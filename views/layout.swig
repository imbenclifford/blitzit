<!doctype html>
<html>
<head>
  <meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="description" content="">
	<meta name="author" content="">
	<link rel="icon" href="../../favicon.ico">
	
  <title>{% block title %}SEALS{% endblock %}</title>

  {% block head %}
		<!-- Bootstrap core CSS -->
    <link href="../../dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href="../../dist/css/jumbotron-narrow.css" rel="stylesheet">
  {% endblock %}
</head>

  <body>

    <div class="container">
      <div class="header">
        <nav>
          <ul class="nav nav-pills pull-right">
            <li role="presentation" class="active"><a href="/home">Add</a></li>
            <li role="presentation"><a href="/pay">Pay</a></li>
          </ul>
        </nav>
        <h3 class="text-muted">SEALS</h3>
      </div>
  {% block content %}{% endblock %}
	
	
<footer class="footer">
        <p>&copy; SEALS 2014</p>
      </footer>

    </div> <!-- /container -->
		
		<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>

    <script src="./js/script.js></script>"

		<!-- Latest compiled and minified JavaScript -->
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script>

    <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
    <script src="../../assets/js/ie10-viewport-bug-workaround.js"></script>
  </body>
</html>