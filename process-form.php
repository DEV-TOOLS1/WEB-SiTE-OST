<?php
// Set error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Process form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = trim($_POST["name"] ?? '');
    $message = trim($_POST["message"] ?? '');
    $priority = filter_input(INPUT_POST, "priority", FILTER_VALIDATE_INT);
    $type = filter_input(INPUT_POST, "type", FILTER_VALIDATE_INT);
    $term = filter_input(INPUT_POST, "term", FILTER_VALIDATE_BOOL);

    // Validation
    $errors = [];

    if (empty($name)) {
        $errors[] = "Name is required";
    }

    if (empty($message)) {
        $errors[] = "Message is required";
    }

    if ($priority === false || $priority < 1 || $priority > 3) {
        $errors[] = "Invalid priority level";
    }

    if ($type === false || $type < 1 || $type > 2) {
        $errors[] = "Invalid message type";
    }

    if (!$term) {
        $errors[] = "You must agree to the terms and conditions";
    }

    // If there are errors, redirect back with errors
    if (!empty($errors)) {
        $error_message = implode(", ", $errors);
        header("Location: contact.html?status=error&message=" . urlencode($error_message));
        exit();
    }

    // SQLite database file
    $db_file = "message_db.db";

    try {
        $conn = new PDO("sqlite:" . $db_file);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch (PDOException $e) {
        header("Location: contact.html?status=error&message=" . urlencode("Database connection failed"));
        exit();
    }

    // Make sure table exists
    try {
        $conn->exec(
            "CREATE TABLE IF NOT EXISTS message (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                body TEXT NOT NULL,
                priority INTEGER NOT NULL,
                type INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )"
        );
    } catch (PDOException $e) {
        header("Location: contact.html?status=error&message=" . urlencode("Database setup failed"));
        exit();
    }

    // Insert data
    $sql = "INSERT INTO message (name, body, priority, type) VALUES (?, ?, ?, ?)";

    try {
        $stmt = $conn->prepare($sql);
        $stmt->execute([$name, $message, $priority, $type]);

        // Success - redirect back with success message
        header("Location: contact.html?status=success&message=" . urlencode("Thank you! Your message has been sent successfully."));
        exit();

    } catch (PDOException $e) {
        header("Location: contact.html?status=error&message=" . urlencode("Failed to save your message. Please try again."));
        exit();
    }
} else {
    // Not a POST request
    header("Location: contact.html");
    exit();
}
?>