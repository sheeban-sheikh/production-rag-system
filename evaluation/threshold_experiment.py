import json

from src.vector_store import load_vector_store, get_documents, search_documents
from src.reranker import reranker


with open("evaluation/test_cases.json", "r", encoding="utf-8") as file:
    test_cases = json.load(file)

vector_store = load_vector_store()

documents = get_documents(vector_store)

selected_document_id = None

for document_id, document_name in documents.items():
    if document_name == "cloudnova_test_document.pdf":
        selected_document_id = document_id
        break

if selected_document_id is None:
    raise ValueError("CloudNova test document not found.")


thresholds = [2.5, 3.0, 4.0, 5.0, 6.0]


for threshold in thresholds:

    total_precision = 0.0
    total_recall = 0.0
    test_count = 0

    print("\n" + "=" * 60)
    print(f"THRESHOLD: {threshold}")
    print("=" * 60)

    for test_case in test_cases:

        question = test_case["question"]
        expected_pages = set(test_case["expected_pages"])

        results = search_documents(
            vector_store,
            question,
            document_id=selected_document_id,
            k=5
        )

        retrieved_documents = [
            document
            for document, score in results
        ]

        if not retrieved_documents:
            actual_pages = set()
        else:
            pairs = [
                (question, document.page_content)
                for document in retrieved_documents
            ]

            scores = reranker.predict(pairs)

            ranked_documents = sorted(
                zip(retrieved_documents, scores),
                key=lambda x: x[1],
                reverse=True
            )

            filtered_documents = [
                document
                for document, score in ranked_documents[:3]
                if score >= threshold
            ]

            actual_pages = {
                document.metadata.get("page", 0) + 1
                for document in filtered_documents
            }

        if actual_pages:
            relevant_retrieved = actual_pages.intersection(expected_pages)
            precision = len(relevant_retrieved) / len(actual_pages)
        else:
            precision = 0.0

        if expected_pages:
            relevant_retrieved = actual_pages.intersection(expected_pages)
            recall = len(relevant_retrieved) / len(expected_pages)

            total_precision += precision
            total_recall += recall
            test_count += 1

        else:
            recall = None

        print(f"\nQuestion: {question}")
        print(f"Expected Pages: {sorted(expected_pages)}")
        print(f"Actual Pages:   {sorted(actual_pages)}")
        print(f"Precision: {precision:.2f}")

        if recall is not None:
            print(f"Recall:    {recall:.2f}")
        else:
            print("Recall:    N/A")

    average_precision = total_precision / test_count
    average_recall = total_recall / test_count

    print("\nOverall:")
    print(f"Average Precision: {average_precision:.2f}")
    print(f"Average Recall:    {average_recall:.2f}")