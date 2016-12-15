/**
 * Created by gaozy on 10/18/16.
 */
function onCodeClick() {
    var code = $("#code").val();
    $.post( "/", { code: code, action: "code"}, function(result){
        window.alert(result);
        $("h6").text(result);
    });
}

function onRecordClick() {
    var record = $("#record").val();
    $.post( "/", { record: record, action:"record"}, function(result){
        window.alert(result);
        $("h6").text(result);
    });
}

function onTestClick() {
    var code = $("#code").val();
    var accessor = $("#accessor").val();
    var value = $("#value").val();
    var qvalue = $("#qvalue").val();
    if(value.localeCompare("")==0)
        value = "{}";
    if(qvalue.localeCompare("")==0)
        qvalue = "{}";
    if(code.localeCompare("")==0){
        window.alert("Please enter your code!");
        return;
    }

    $.post("/test", {code: code, value: value, qvalue: qvalue, accessor: accessor},
       function(data){
            alert(data);
            var json = JSON.parse(data);
            var value = json["value"];
            var qvalue = json["qvalue"];
            var err = json["err"];
            $("#value").val(value);
            $("#qvalue").val(qvalue);
            $("#err").val(err);
       }
    );
}

function adjust_textarea(h) {
    h.style.height = "20px";
    h.style.height = (h.scrollHeight)+"px";
}

const noop_code = "function run(value, field, querier) {\n\
    return value;\n\
}";

const random_code = 'function run(value, field, querier) {\n\
    var a = value["A"];\n\
    var records = a.get("record");\n\
    var rand = records.get(Math.ceil(Math.random()*records.length())-1);\n\
    var length = records.length();\n\
    for (var i = length-1; i>=0; i--) {\n\
        records.remove(i);\n\
    }\n\
    records.put(rand);\n\
    return value.put("A", a.put("record", records).put("ttl",0));\n\
}';

const latency_code = '';


function onChange(){
    var chosen = $("#codeExamples").val();
    switch(chosen){
        case "noop":
            $("#code").val(noop_code);
            break;
        case "random":
            $("#code").val(random_code);
            break;
        case "latency":
            $("#code").val(latency_code);
            break;
        default:
            break;
    }
}