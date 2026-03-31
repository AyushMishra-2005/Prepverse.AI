from flask import Flask
from flask_cors import CORS   

from models.ml_model import load_models

from routes.recommend_routes import bp as recommend_bp
from routes.embed_routes import bp as embed_bp
from routes.eligibility_routes import bp as eligibility_bp
from routes.utility_routes import bp as utility_bp  

app = Flask(__name__)

CORS(app)  

app.register_blueprint(recommend_bp)
app.register_blueprint(embed_bp)
app.register_blueprint(eligibility_bp)
app.register_blueprint(utility_bp)   

if __name__ == "__main__":
    load_models()
    print("Server running...")
    app.run(host="0.0.0.0", port=5000, debug=True)