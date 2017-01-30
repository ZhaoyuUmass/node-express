/**
 * Created by gaozy on 1/5/17.
 */

var run1 = function(value,accessor,querier){
    // Initialize variables
    var ip = value.ip,
        record = value.A.record;
    // retrieve the routing history
    var q = querier.readGuid(null, "decision", "load");
    var selectReplica = function(client_ip, record){
        // select replicas from the replica pool based on client ip
    }
    var replicas = selectReplica(ip, record);
    // record the routing decision
    q.decision[ip] = q.decision[ip][replicas[0]];
    q.load[ip] = q.load[ip] + 1;
    // write to GNS
    querier.writeGuid(null, q);
    return value;
}

var run2 = function(value,accessor,querier){
    // Initialize variables
    var client_ip = value.ip,
        record = value.A.record,
        i=-1, r = Math.random(),
        weights = querier.readGuid(null, "weight").weight;
    var getClientWeight = function(client, weights){
        //get client-to-replica mapping vector from weights based on client info
    };
    var w = getClientWeight(client_ip, weights);
    var isLargerThan = function(element) {
        return (element > 0);
    }
    var indexes = w.filter(isLargerThan(0));

    // Get return value based on weight
    while(r>=0){
        i++;
        r = r - w[indexes[i]];
    }
    value.A.record = [record[i]];
    return value;
}


const distance_threshold=50,
    load_threshold = 0.95,
    capacity = 1000,
    capacity_threshold = load_threshold*capacity;

var run3 = function(value,accessor,querier){
// initialize variables
var distance = function(server, client){
    // return distance between server and client
    },
    isSmallerThan = function(thres) {
        return function(element) {
            return (element > thres);
        }
    },
    client_ip = value.ip,
    datacenter = value.A.record,
    dist = [],
    sorted_dist = null;
    load = querier.readGuid(null, "load").load,
    price = querier.readGuid("electricity service", "price").price;
    datacenter.forEach(function(element){dist.push(distance(element, client_ip))});
var min_dist = Math.min.apply(Math, dist);
var best=datacenter[dist.indexOf(min_dist)];

if(min_dist>distance_threshold){
    var new_dist = [];
    datacenter.forEach(function(element){new_dist.push(distance(element, best))});
    sorted_dist = new_dist.slice().filter(isSmallerThan(50)).sort(function(a,b) {return a-b;});
}else{
    sorted_dist = dist.slice().filter(isSmallerThan(distance_threshold)).sort(function(a,b) {return a-b;});
}
for(var i=0;i<dist.length; i++){
    if(load[datacenter[dist.indexOf(sorted_dist[i])]]<capacity_threshold){
        value.A.record = [datacenter[dist.indexOf(sorted_dist[i])]];
        break;
    }
}
// record the new load then return value
return value;
}

var run4 = function(value,accessor,querier){
    var getSubnet = function(ip){
            // return subnet of the ip
        },
        client_ip = value["ip"],
        subnet = getSubnet(client_ip),
        load = querier.readGuid(null, "load").load;
    if(load[subnet]>5)
        value.A.record = null;
    load[subnet] = load[subnet]+1;
    querier.write(null, load);
    return value;
}