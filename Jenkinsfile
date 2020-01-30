pipeline {
    agent none
    environment {
        REPO_TAG='master'
        COMPONENT_VERSION='1.0'
        GIT_USER='aninarj'
        GIT_USER_PERSONAL_ACCESS_TOKEN='c9cd5796887bfd72c29a4efe046d6e13abb70ca3'
        BUILD_FOLDER='/opt/ng-calculator_1'
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
                        sh 'mkdir -p /root/local_m2/ra/.m2'
                    }
                }
            }
        }
    
    stage('BUILD') {
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
                        sh 'export'
                        sh 'yum -y install git'
                        sh 'yum -y install gcc'
                        sh 'yum -y install gcc-c++'
                        sh 'yum -y install make'
                        sh 'yum -y install ncurses-devel'
                        sh 'yum -y install zlib-devel'
                        sh 'yum -y install unixODBC-devel'
                        sh 'yum -y install unzip'
                        sh 'yum -y install docker-client'
                        sh 'yum -y install wget'
                        
                        sh '''
                            cd /opt
                            curl -o jdk-8u231-linux-x64.rpm http://artifactory-lvn.broadcom.net/artifactory/generic-third-party-local/java/jdk/jdk-8u231-linux-x64.rpm
                            rpm -i jdk-8u231-linux-x64.rpm
                            
                            M2_HOME=/opt/apache-maven-3.2.3
                            if [ ! -d $M2_HOME ]
                            then
                                curl -o apache-maven-3.2.3-bin.tar.gz http://artifactory-lvn.broadcom.net/artifactory/generic-third-party-local/riskfort/apache-maven-3.2.3-bin.tar.gz
                                tar xfz apache-maven-3.2.3-bin.tar.gz
                            fi
                            
                            ANT_HOME=/opt/apache-ant-1.9.2
                            if [ ! -d $ANT_HOME ]
                            then
                                curl -o apache-ant-1.9.2-bin.tar.gz http://artifactory-lvn.broadcom.net/artifactory/generic-third-party-local/riskfort/apache-ant-1.9.2-bin.tar.gz
                                tar xfz apache-ant-1.9.2-bin.tar.gz
                            fi
                            
                            if [ ! -f $ANT_HOME/lib/maven-ant-tasks-2.1.3.jar ]
                            then
                                curl -o $ANT_HOME/lib/maven-ant-tasks-2.1.3.jar http://artifactory-lvn.broadcom.net/artifactory/generic-third-party-local/riskfort/maven-ant-tasks-2.1.3.jar
                            fi
                            
                            if [ ! -f $ANT_HOME/lib/xmltask.jar ]
                            then
                                curl -o $ANT_HOME/lib/xmltask.jar.zip http://artifactory-lvn.broadcom.net/artifactory/generic-third-party-local/riskfort/xmltask.jar.zip
                                unzip -d $ANT_HOME/lib $ANT_HOME/lib/xmltask.jar.zip
                            fi
                            
                            if [ ! -f $ANT_HOME/lib/ant-contrib-1.0b3.jar ]
                            then
                                curl -o ant-contrib-1.0b3-bin.tar.gz http://artifactory-lvn.broadcom.net/artifactory/generic-third-party-local/riskfort/ant-contrib-1.0b3-bin.tar.gz
                                tar xfz ant-contrib-1.0b3-bin.tar.gz
                                mv -f ant-contrib/ant-contrib-1.0b3.jar $ANT_HOME/lib
                            fi
                        '''
                    }
                }
              stage('Checkout Code') {
                    steps {
                        sh '''
                            mkdir -p $BUILD_FOLDER
                            git clone https://$GIT_USER:$GIT_USER_PERSONAL_ACCESS_TOKEN@https://github.com/AninaRJ/ng-calculator.git -b $REPO_TAG $BUILD_FOLDER/ng-calculator
                        '''
                    }
                }
              stage('Compile and Build') {
                    steps {
                        sh '''
                            docker build -t ng-calculator:$BUILD_NUMBER -f Dockerfile
                        '''
                    }
                }
            }
    }
  }
}
  

