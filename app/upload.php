<?

	// Remember To Do something with your uploads!

	$f = $_FILES["file"];
	$file = $f["name"];

	$error = false;

	if ($error) {
		die("ERROR: " . $error);
	} else {
		die($file);
	}

?>