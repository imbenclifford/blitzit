{% extends 'layout.swig' %}

{% block title %}Blitzit{% endblock %}

{% block head %}
  {% parent %}
  <link rel="stylesheet" href="custom.css">
{% endblock %}

{% block content %}
			<div class="jumbotron" id="donate">
        <h1>Get it done.</h1>
        <p class="lead">You said {{status}}. Your deadline is {{date}} at {{time}}
        <form action = "/completed" method = "post">
          <input type="submit" name="id" value="{{id}}" class="btn btn-success">
          </form>
        </p>
        <p>
        <h3>Set a task</h3>
					<form action = "/create" method = "post">
          Your task: <input type="text" name="task">
					<input type="submit" name="addOne" class="btn btn-success">
					</form>
				</p>	
      </div>
{% endblock %}