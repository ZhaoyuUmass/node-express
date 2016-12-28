/**
 * Created by gaozy on 12/27/16.
 */

// a distance function
function distance(lat1, lon1, lat2, lon2) {
    if(lat1 == undefined || lat2 == undefined) return Number.MAX_VALUE;
    var R = 6371; // Radius of the earth in km
    var dLat = (lat2 - lat1) * Math.PI / 180;  // deg2rad below
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a =
        0.5 - Math.cos(dLat)/2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        (1 - Math.cos(dLon))/2;

    return R * 2 * Math.asin(Math.sqrt(a));
}

function run(value, accessor, querier) {
    // 0. convert DONAR cost function to geo-distance
    var myIndex = null,//substitude with your own index,
        records = value["A"]["record"], // an array of IP addresses for all replicas
        client = value["A"]["client_ip"],
        coords = querier.getLocations(records.push(client)), // the returned value is formatted as {ip1: {"latitude":lat1, "longitude":lng1},...}
        costs = [],
        i=0;

    for(i=0; i<records.length; i++){
        // some ip may not be able to be resolved, and the value will be the Number.MAX_VALUE
        costs.push(distance(coords[records[i]]["latitude"], coords[records[i]]["longitude"],
            coords[client]["latitude"], coords[client]["longitude"]));
    }

    // 1. collect the latest P_ni for all n, itself and all other nodes
    var P = querier.readGuid(null, "");

    // 2. collect the latest lambda_i for every replica i

    // 3. solve optimization problem: min s*sum(alpha(sum(r*cost)) + sum(lambda*((p-w)-epsilon))

    // 4. compute p_ni and update

    // 5. Update lambda

    // return result

    return value;
}