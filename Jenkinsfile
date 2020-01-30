pipeline {
    agent none
    environment {
        REPO_TAG='master'
        COMPONENT_VERSION='1.0'
        GIT_USER='aninarj'
        GIT_USER_PERSONAL_ACCESS_TOKEN='c9cd5796887bfd72c29a4efe046d6e13abb70ca3'
        BUILD_FOLDER='/opt'
        BASE_IMAGE_OS='docker-release-candidate-local.artifactory-lvn.broadcom.net/psd-standard-images/psd_centos7:latest'
    }
  
  stages {
        
      stage('PREREQUISITE') {
            agent {
               label "IRIS_Build_Machine"
            }
            stages {
                stage('Validate Build Agent') {
                    steps {
                        sh 'docker --version'
                        sh 'docker image ls'
                        sh 'docker container ls'
                        sh 'docker login -u rabuild -p P@55word docker-release-candidate-local.artifactory-lvn.broadcom.net'
                        sh 'docker pull $BASE_IMAGE_OS'
                    }
                }
            }
        }
    
    stage('BUILD AND RUN') {
            agent { 
                docker { 
                    image 'centos:7'
                    label "IRIS_Build_Machine"
                    args "-v /var/run/docker.sock:/var/run/docker.sock -v /root/local_m2/ra/.m2:/root/.m2"
                }
            }
            stages {
                stage('Setup Build Box') {
                    steps {
                        sh 'yum -y install git'
                        sh 'yum -y install docker-client'
                    }
                }
              stage('Checkout Code') {
                    steps {
                        sh '''
                            mkdir -p $BUILD_FOLDER
                            git clone https://github.com/AninaRJ/ng-calculator.git -b $REPO_TAG $BUILD_FOLDER
                        '''
                    }
                }
              stage('Cleanup'){
                  steps{
                      sh '''
                      if [[ "$(docker images |grep 'ng-calculator')" == "" ]]; then
                          docker rmi $(docker images |grep 'ng-calculator')
                      fi
                      '''
                  }
              }
              stage('Compile and Build') {
                    steps {
                        sh '''
                            docker build -t ng-calculator:$BUILD_NUMBER -f Dockerfile .
                        '''
                    }
                }
                stage('Start container'){
                      steps{
                          sh '''
                                docker run -p 49160:7070 -d ng-calculator:$BUILD_NUMBER
                            '''
                      }
                  }
                  stage('Check status'){
                      steps{
                          sh 'curl -i localhost:49160'
                      }
                  }
            }
    }
  }
}
  

