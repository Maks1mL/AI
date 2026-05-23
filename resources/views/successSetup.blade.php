<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Success</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #ffffff;
            margin: 0;
            padding: 0;
        }

        .container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            text-align: center;
            background-color: #ffffff;
            padding: 20px;
        }

        .content {
            text-align: center;
            font-size: 12px;
            color: #888888;
            padding: 20px;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="container">
        <!-- Body Content -->
        <div class="content">
            <h3 style="color: #333333; text-align: center; font-size:22px; margin:35px">Congratulations!!!!</h3>
            <p style="color: #333333; text-align: center; font-size:16px; margin:35px">Your Application Has Been Set-up Successfully</p>
            <a href="{{ route('login') }}" style="color: #007bff; text-align: center; font-size:16px; margin:35px">Click here to login</a>
        </div>
    </div>
</body>

</html>
