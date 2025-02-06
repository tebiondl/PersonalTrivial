import csv
import json


def convert_csv_to_json(csv_file_path, json_file_path):
    data = []
    try:
        with open(csv_file_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                # Assuming the CSV has headers 'question' and 'answer'
                data.append({"question": row.get("question", "").strip(), "answer": row.get("answer", "").strip()})
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return
    try:
        with open(json_file_path, "w", encoding="utf-8") as jsonfile:
            json.dump(data, jsonfile, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Error writing JSON: {e}")
        return
    print(f"Successfully converted {csv_file_path} to {json_file_path}")


if __name__ == '__main__':
    csv_path = "data/questions.csv"
    json_path = "data/realquestions.json"
    convert_csv_to_json(csv_path, json_path) 