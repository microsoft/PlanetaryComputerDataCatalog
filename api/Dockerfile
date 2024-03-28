FROM mcr.microsoft.com/azure-cli:cbl-mariner2.0

ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true

RUN tdnf install libicu unzip wget -y
RUN wget https://github.com/Azure/azure-functions-core-tools/releases/download/4.0.5530/Azure.Functions.Cli.linux-x64.4.0.5530.zip
RUN mkdir -p /usr/local/lib/Azure.Functions.Cli
RUN unzip Azure.Functions.Cli.linux-x64.4.0.5530.zip -d /usr/local/lib/Azure.Functions.Cli
RUN chmod +x /usr/local/lib/Azure.Functions.Cli/func

ENV PATH="/usr/local/lib/Azure.Functions.Cli:${PATH}"

RUN python3 -m ensurepip --upgrade
COPY requirements.txt /
RUN pip3 install -r /requirements.txt

COPY requirements-dev.txt /
RUN pip3 install -r /requirements-dev.txt
