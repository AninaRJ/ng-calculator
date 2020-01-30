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
                            git clone https://github.com/AninaRJ/ng-calculator.git -b $REPO_TAG $BUILD_FOLDER/ng-calculator
                            cd $BUILD_FOLDER/ng-calculator
                            chmod +x docker-entrypoint.sh
                        '''
                    }
                }
             /*stage('Cleanup'){
                  steps{
                      sh '''
                      if [[ "$(docker images |grep 'ng-calculator')" != "" ]]; then
                          docker rmi -f $(docker images |grep 'ng-calculator')
                      fi
                      '''
                  }
              }*/
              stage('Compile and Build') {
                    steps {
                        sh '''
                            docker build -t ng-calculator:$BUILD_NUMBER -f Dockerfile .
                        '''
                    }
                }
               /* stage('Start container'){
                      steps{
                          sh '''
                                docker run --name ng-calculator -p 9080:8080 -d ng-calculator:$BUILD_NUMBER
                            '''
                      }
                  }
                  stage('Check status'){
                      steps{
                          sh 'curl -i localhost:49160'
                      }
                  }*/
                stage('Upload Images') {
                    steps {
                        parallel (
                                ngCalculator: {
                                    sh '''
                                    docker tag ng-calculator:$BUILD_NUMBER docker-release-candidate-local.artifactory-lvn.broadcom.net/rs_docker/ng-calculator:$BUILD_NUMBER
                                    docker push docker-release-candidate-local.artifactory-lvn.broadcom.net/rs-docker/ng-calculator:$BUILD_NUMBER
                                '''
                                }
                        )
                    }
                }
                stage('Cleanup') {
                    steps {
                        sh '''
                            docker image rm ng-calculator:$BUILD_NUMBER
                           
                        '''
                    }
                }

            }
    }
  }
}
  

