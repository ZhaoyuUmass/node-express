/**
 * Created by gaozy on 10/18/16.
 */
function onCodeClick() {
    var code = editor.getValue(); //$("#code").val();
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

function onMXClick() {
    var mx = $("#mx").val();
    window.alert("ready to update mx:"+mx);
    $.post("/", { mx: mx, action:"mx"}, function(result){
       window.alert(result);
        $("h6").text(result);
    });
}

function onNSClick() {
    var ns = $("#ns").val();
    window.alert("ready to update ns:"+ns);
    $.post("/", { ns: ns, action:"ns"}, function(result){
        window.alert(result);
        $("h6").text(result);
    });
}

function onCNAMEClick() {
    var cname = $("#cname").val();
    $.post("/", {cname: cname, action:"cname"}, function(result){
        window.alert(result);
        $("h6").text(result);
    });
}

function onFiledClick() {
    // FIXME: this needs to update based on the UI desgin
    var field = $("#field").val();
    $.post("/", {field:field, action:"field"}, function(result){
       window.alert(result);
        $("h6").text(result);
    });
}

function onTestClick() {
    var code = editor.getValue(); //$("#code").val();
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

const noop_code = "function run(value, accessor, querier) {\n\
    return value;\n\
}";

const random_code = 'function run(value, accessor, querier) {\n\
    var records = value["A"]["record"];\n\
    var rand = Math.ceil(Math.random()*records.length)-1;\n\
    value["A"]["record"] = records.slice(rand, rand+1);\n\
    return value;\n\
}';


const latency_code = 'function distance(lat1, lon1, lat2, lon2) {\n\
    if(lat1 == undefined || lat2 == undefined) return Number.MAX_VALUE;\n\
    var R = 6371; // Radius of the earth in km\n\
    var dLat = (lat2 - lat1) * Math.PI / 180;  // deg2rad below \n\
    var dLon = (lon2 - lon1) * Math.PI / 180; \n\
    var a = \n\
        0.5 - Math.cos(dLat)/2 + \n\
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * \n\
        (1 - Math.cos(dLon))/2; \n\
    \n\
    return R * 2 * Math.asin(Math.sqrt(a)); \n\
}\n\
\n\
function run(value, accessor, querier) {\n\
    var records = value.A.record,\n\
        client_ip = value.client_ip,\n\
        newRecords = [],\n\
        dist = [],\n\
        locs = records.slice(),\n\
        i=0;\n\
\n\
    locs.push(client_ip);\n\
\n\
    var coords = querier.getLocations(locs);\n\
    // do not calculate the distance for client\n\
    for(i=0; i<records.length; i++){\n\
        dist.push(Math.round(distance(coords[records[i]]["latitude"], coords[records[i]]["longitude"],\n\
            coords[client_ip]["latitude"], coords[client_ip]["longitude"])));\n\
    }\n\
\n\
    // figure out all candidates\n\
    var minimal_distance = Math.min.apply(Math, dist),\n\
        pos = 0,\n\
        k = 0\n\
    i=-1;\n\
\n\
    while ((i = dist.indexOf(minimal_distance, i+1)) != -1){\n\
        var diff = i-pos;\n\
        records.splice(k,diff);\n\
        k++;\n\
        pos = i;\n\
    }\n\
    records.splice(k,records.length-k);\n\
\n\
    return value;\n\
}';


function onChange(){
    var chosen = $("#codeExamples").val();
    switch(chosen){
        case "noop":
            editor.setValue(noop_code);
            break;
        case "random":
            editor.setValue(random_code);
            break;
        case "latency":
            editor.setValue(latency_code);
            break;
        default:
            break;
    }
}