import requests
import os
session = requests.Session()
session.auth = ('admin','admin@sonar@123')
auth=session.post("https://sonarqube.uat.flush.com")
response1 = session.get("https://sonarqube.uat.flush.com/api/qualitygates/project_status?projectKey=demo11234_testing_AYD6IcOGpv5dR6jvu849",auth=('admin','admin@sonar@123'))
print(response1)
a=response1.json()
if(a['projectStatus']['status'])=="ERROR":
    print("Pipeline exited Please Check issues in sonarqube")
    c
print("No issues in Code !!")
