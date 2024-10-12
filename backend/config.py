class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///users.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class DevelopmentConfig(Config):
    CORS_ORIGIN = 'http://localhost:3000'
    DEBUG = True

class ProductionConfig(Config):
    CORS_ORIGIN = 'https://abmenon.pythonanywhere.com'
    DEBUG = False