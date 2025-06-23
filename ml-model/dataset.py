import csv
import random

# Define ideal answers for each of the 14 careers
career_preferences = {
    "Software Engineer":     [0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0],
    "Psychologist":          [2, 3, 2, 2, 3, 3, 2, 4, 2, 2, 3, 3, 3, 3, 3, 2, 3, 2],
    "UX Designer":           [1, 4, 2, 2, 4, 3, 2, 1, 1, 3, 4, 3, 2, 2, 2, 1, 2, 3],
    "Doctor":                [3, 3, 1, 3, 2, 3, 3, 3, 2, 3, 2, 3, 2, 3, 3, 2, 3, 2],
    "Engineer":              [1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0],
    "Writer":                [4, 4, 3, 4, 4, 3, 4, 3, 4, 4, 4, 3, 3, 4, 4, 4, 3, 4],
    "Scientist":             [1, 0, 1, 0, 1, 0, 0, 2, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1],
    "Graphic Designer":      [3, 4, 4, 4, 4, 3, 4, 3, 3, 4, 4, 4, 3, 3, 4, 4, 3, 4],
    "Philosopher":           [4, 3, 4, 3, 4, 2, 3, 4, 3, 3, 4, 4, 4, 4, 4, 4, 3, 4],
    "Data Analyst":          [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0],
    "Social Worker":         [3, 3, 3, 3, 4, 3, 3, 4, 3, 4, 3, 4, 3, 4, 3, 3, 3, 3],
    "Entrepreneur":          [2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 3, 2, 2, 3, 3, 2, 2, 2],
    "Marketing Specialist":  [2, 3, 2, 4, 3, 4, 3, 2, 2, 4, 3, 3, 3, 3, 4, 3, 3, 3],
    "Product Manager":       [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
}

# CSV column headers
fields = [f"Q{i}" for i in range(18)] + ["Career"]

# Final list of all rows
rows = []

# Generate 30 rows per career
for career, preferences in career_preferences.items():
    for _ in range(30):  # 30 samples
        answers = []
        for ans in preferences:
            # 80% chance to keep ideal, 20% chance to add small noise
            if random.random() < 0.8:
                answers.append(ans)
            else:
                # small noise: pick another close value
                nearby = [x for x in range(5) if x != ans]
                answers.append(random.choice(nearby))
        answers.append(career)
        rows.append(answers)

# Save to CSV
with open("structured_career_data.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(fields)
    writer.writerows(rows)

print("✅ structured_career_data.csv generated with", len(rows), "rows.")
