pipeline {
    agent any

    tools {
        maven "M3"
    }
    environment {
        PATH = "/usr/local/bin:/opt/homebrew/bin:${env.PATH}"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Ananya1174/utility-billing-system.git'
            }
        }

        stage('Build Backend (Maven)') {
            steps {
                dir('backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Docker Compose Build') {
            steps {
                dir('backend') {
                    sh 'docker compose build'
                }
            }
        }

        stage('Docker Compose Up') {
            steps {
                dir('backend') {
                    sh 'docker compose up -d'
                }
            }
        }
    }
}