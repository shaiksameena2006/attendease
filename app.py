# -------------------------------
# 📄 GOOGLE SHEETS FUNCTIONS (UPDATED)
# -------------------------------

def get_sheet():
    scope = [
        "https://spreadsheets.google.com/feeds",
        "https://www.googleapis.com/auth/drive"
    ]

    creds = ServiceAccountCredentials.from_json_keyfile_name(
        "attendease.json",
        scope
    )

    client = gspread.authorize(creds)
    sheet = client.open("Copy of Aavishkar 2026").sheet1
    return sheet


def get_today_afternoon_column(sheet):
    today = datetime.now().strftime("%d-%m-%Y")

    header = sheet.row_values(1)      # Dates row
    sub_header = sheet.row_values(2)  # Morning/Afternoon row

    for col in range(len(header)):
        if header[col] == today and sub_header[col] == "Afternoon":
            return col + 1

    return None


def mark_all_absent(sheet, col):
    data = sheet.get_all_records()

    for i in range(len(data)):
        row_number = i + 3  # data starts from row 3
        sheet.update_cell(row_number, col, "A")

    print("🟥 All marked ABSENT")


def mark_present_students(sheet, col, scanned_names):
    data = sheet.get_all_records()

    for i, row in enumerate(data):
        sheet_name = row["Name"]

        for scanned in scanned_names:
            # 🔥 TEMP MATCH (since names differ)
            short_name = scanned.replace("KGRCET_", "")

            if short_name.lower() in sheet_name.lower():
                row_number = i + 3
                sheet.update_cell(row_number, col, "P")
                print(f"🟩 {sheet_name} marked PRESENT")
                break