/**
 * Created by gaozy on 10/18/16.
 */
function onClick() {
    var code = document.getElementById("code").value;
    var record = document.getElementById("record").value;
    $.post( "/", { code: code, record: record }, function(result){
        window.alert(result);
        $("h5").text(result);
    });

}