
from flask import Blueprint, render_template

main_bp = Blueprint('main_bp', __name__)

@main_bp.route("/")
def home():
    return render_template("home.html")

@main_bp.route("/game")
def game():
    return render_template("game.html")