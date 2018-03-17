<?php
    $json = file_get_contents(__DIR__ . "/../rev-manifest.json");
    $assets = json_decode($json, true);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title></title>
    <link rel="stylesheet" type="text/css" href="/<?php echo $assets['assets/build/css/main.css'] ?>"/>
</head>
<body>
    <h1>Gulp example</h1>

    <script type="text/javascript" src="/<?php echo $assets['assets/build/js/main.js'] ?>"></script>
</body>
</html>
