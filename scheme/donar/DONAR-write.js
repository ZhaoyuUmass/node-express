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
    if(!value.hasOwnProperty("lambda") && !value.hasOwnProperty("P")){
        // if this is not a periodical update request for the price and redirection probability field of a DONAR mapping node
        return value;
    }

    // 0. Initialize arbitrary price and decision
    var aRecord = querier.readGuid(null, "A")["A"],
        weight = querier.readGuid(null, "weight")["weight"],
        // the set of clients have been divided into a few groups on, e.g., continent-level or country-level
        clientRegion = querier.readGuid(null, "clientRegion")["clientRegion"],
        P = value["P"],
        lambda = value["lambda"],
        dist = [],
        i = 0;


    // calculate the distance between servers and clients
    for(i=0; i<records.length; i++){
        dist.push(Math.round(distance(coords[records[i]]["latitude"], coords[records[i]]["longitude"],
            coords[client]["latitude"], coords[client]["longitude"])));
    }
    

    // 1. collect the latest P_ni for all n, itself and all other nodes

    // 2. collect the latest lambda_i for every replica i

    // 3. solve optimization problem: min s*sum(alpha(sum(r*cost)) + sum(lambda*((p-w)-epsilon))

    // 4. compute p_ni and update

    // 5. Update lambda

    // return result

    return value;
}