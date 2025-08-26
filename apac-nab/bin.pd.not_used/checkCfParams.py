
# NOTE: this script was rewritten to bash using xmlstarlet - it handles namespaces more safe
exit()

mandatoryProcessVariables = [
    "idv",
    "usedDocumentList",
    "selectedDocType",
    "_initVars",
    "idv_log",
    "idv_secret",
    "idv_functions",
]

mandatoryCloudSecrets = [
    "${idv.configSecrets[0]}",
    "${idv.configSecrets[1]}",
    "${idv.configSecrets[2]}",
    "${idv.configSecrets[3]}",
    "${idv.configSecrets[4]}",
    "${idv.configSecrets[5]}",
    "${idv.configSecrets[6]}",
    "${idv.configSecrets[7]}",
    "${idv.configSecrets[8]}",
    "${idv.configSecrets[9]}",
]

namesToSkip = [
    "ConfigureStep1",
    "ConfigureStep2",
]

ns = {
    "bpmn": "http://www.omg.org/spec/BPMN/20100524/MODEL",
    "bioc": "http://bpmn.io/schema/bpmn/biocolor/1.0",
    "bpmndi": "http://www.omg.org/spec/BPMN/20100524/DI",
    "camunda": "http://camunda.org/schema/1.0/bpmn",
    "color": "http://www.omg.org/spec/BPMN/non-normative/color/1.0",
    "dc": "http://www.omg.org/spec/DD/20100524/DC",
    "di": "http://www.omg.org/spec/DD/20100524/DI",
    "xsi": "http://www.w3.org/2001/XMLSchema-instance",
    "modeler": "http://camunda.org/schema/modeler/1.0",
}


processVariablesPath = ".//camunda:inputParameter[@name='processVariables']/camunda:list"
cloudSecretsPath = ".//camunda:inputParameter[@name='cloudSecrets']/camunda:list"


def update(root, path, data):

    for cf in root.findall(".//bpmn:serviceTask[@camunda:delegateExpression='${syncCloudFunctionExecutorV2}']", ns):
        # extract function name
        processFlag = True
        for nameNode in cf.findall(".//camunda:inputParameter[@name='functionName']", ns):
            functionName = nameNode.text
            if functionName in namesToSkip:
                processFlag = False

        if not processFlag:
            continue

        for list in cf.findall(path, ns):
            present = []  # values already present in the list
            for i in list.findall("./camunda:value", ns):
                present.append(i.text)
            for item in data:
                if not item in present:
                    new_element = ET.Element("camunda:value")
                    new_element.text = item
                    list.append(new_element)
    return


#######################################################################
# actual code begins here
import xml.etree.ElementTree as ET

import sys

if len(sys.argv) < 3:
    print(f"usage: {sys.argv[0]} <input file> <output file>")
else:
    xmlFileName = sys.argv[1]
    destFileName = sys.argv[2]

    for k, v in ns.items():
        ET.register_namespace(k, v)

    #   <camunda:inputParameter name="processVariables" id="ECF02-i-pv_qyg" labelName="Process Variables" skyId="ECF02-i-pv" type="LIST_STRING">
    #     <camunda:list>
    #       <camunda:value>idv</camunda:value>

    tree = ET.parse(xmlFileName)
    root = tree.getroot()

    # processVariables = {}
    # for list in root.findall(".//camunda:inputParameter[@name='processVariables']/camunda:list", ns):
    #    for i in list.findall("./camunda:value", ns):
    #        processVariables[i.text] = True

    # append new element
    # new_element = ET.Element("camunda:value")
    # new_element.text = "New data"
    # list.append(new_element)

    update(root, processVariablesPath, mandatoryProcessVariables)
    update(root, cloudSecretsPath, mandatoryCloudSecrets)

    # write to file
    ET.indent(tree, space="    ", level=0)
    tree.write(destFileName, encoding="utf-8")
