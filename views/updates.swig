{% extends 'layout.swig' %}

{% block title %}SEALS{% endblock %}

{% block head %}
  {% parent %}
  <link rel="stylesheet" href="custom.css">
{% endblock %}

{% block content %}
			<div class="jumbotron" id="donate">
        <h1>Get it done.</h1>
        <p class="lead">You said {{status}}. Your deadline is {{date}} at {{time}}</p>
        <p>
					<form action = "/create" method = "post">
					<input type="submit" name="addOne" value="Say WE" class="btn btn-lg btn-success" />
					</form>
				</p>	
      </div>
{% endblock %}