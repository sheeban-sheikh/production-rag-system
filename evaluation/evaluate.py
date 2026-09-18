import json

from src.evaluator import evaluate_faithfulness
from src.evaluator import evaluate_answer
from src.vector_store import load_vector_store, get_documents, search_documents
from src.reranker import rerank_documents
from src.rag import generate_answer


# Load evaluation test cases
with open("evaluation/test_cases.json", "r", encoding="utf-8") as file:
    test_cases = json.load(file)


# Load vector database
vector_store = load_vector_store()

# Get available documents
documents = get_documents(vector_store)

# Select CloudNova document for evaluation
selected_document_id = None

for document_id, document_name in documents.items():
    if document_name == "cloudnova_test_document.pdf":
        selected_document_id = document_id
        break


if selected_document_id is None:
    raise ValueError("CloudNova test document not found.")


print("\n" + "=" * 60)
print("RAG EVALUATION")
print("=" * 60)

total_precision = 0.0
total_recall = 0.0
total_answer_correctness = 0.0
total_faithfulness = 0.0
retrieval_test_count = 0

for index, test_case in enumerate(test_cases[5:], start=6):

    question = test_case["question"]

    print("\n" + "=" * 60)
    print(f"TEST CASE {index}")
    print("=" * 60)

    print(f"\nQuestion: {question}")

    # No conversation history for isolated evaluation
    chat_history = []

    # Query rewriting
    standalone_query = question

    # Vector search
    results = search_documents(
        vector_store,
        standalone_query,
        document_id=selected_document_id,
        k=5
    )

    # Convert tuples to documents
    retrieved_documents = [
        document
        for document, score in results
    ]

    # Reranking
    reranked_documents = rerank_documents(
        standalone_query,
        retrieved_documents,
        top_n=3,
        score_threshold=0.0
    )

    # Generate answer
    answer, source_documents = generate_answer(
        question,
        reranked_documents,
        chat_history
    )

    print("\nExpected Answer:")
    print(test_case["expected_answer"])

    print("\nActual Answer:")
    print(answer)

    faithfulness_score = evaluate_faithfulness(
        question,
        answer,
        reranked_documents
    )

    print(f"Faithfulness Score: {faithfulness_score:.2f}")
    total_faithfulness += faithfulness_score

    answer_score = evaluate_answer(
        question,
        test_case["expected_answer"],
        answer
    )
    

    print(f"\nAnswer Correctness Score: {answer_score:.2f}")
    total_answer_correctness += answer_score

    print("\nExpected Pages:")
    print(test_case["expected_pages"])

    actual_pages = sorted(
        set(
            document.metadata.get("page", 0) + 1
            for document in source_documents
        )
    )

    print("Actual Pages:")
    print(actual_pages)

        # Retrieval Precision
    retrieved_pages = set(actual_pages)
    expected_pages = set(test_case["expected_pages"])

    if retrieved_pages:
        relevant_retrieved = retrieved_pages.intersection(expected_pages)
        precision = len(relevant_retrieved) / len(retrieved_pages)
    else:
        precision = 0.0

    # Retrieval Recall
    if expected_pages:
        relevant_retrieved = retrieved_pages.intersection(expected_pages)
        recall = len(relevant_retrieved) / len(expected_pages)
    else:
        recall = None

    print(f"Retrieval Precision: {precision:.2f}")
    if recall is not None:
        total_precision += precision
        total_recall += recall
        retrieval_test_count += 1

    if recall is not None:
        print(f"Retrieval Recall: {recall:.2f}")
    else:
        print("Retrieval Recall: N/A")

print("\n" + "=" * 60)
print("OVERALL RETRIEVAL METRICS")
print("=" * 60)

average_precision = total_precision / retrieval_test_count
average_recall = total_recall / retrieval_test_count

average_answer_correctness = (
    total_answer_correctness / len(test_cases)
)

average_faithfulness = (
    total_faithfulness / len(test_cases)
)

print(f"Average Retrieval Precision: {average_precision:.2f}")
print(f"Average Retrieval Recall: {average_recall:.2f}")
print(f"Average Answer Correctness: {average_answer_correctness:.2f}")
print(f"Average Faithfulness: {average_faithfulness:.2f}")

