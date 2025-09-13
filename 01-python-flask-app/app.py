from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return "Hello, This is Devik Jagani. This is Python Flask app on Docker!"

if __name__ == '__main__':
    app.run(host='0.0.0.0')
