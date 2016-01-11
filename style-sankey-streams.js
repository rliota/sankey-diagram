


function traverse(streamLinks, action){
    var i, limit, streamLink, results = [];
    for(i=0, limit = streamLinks.length; i<limit; i++){
        streamLink = streamLinks[i];
        results = results.concat(action(streamLink));
    }
    return results;
}

function traverseUpStream(link){
    var connections = [[link.source.name, link.target.name]];
    if(link.source){
        return connections.concat(
            traverse(
                link.source.targetLinks,
                traverseUpStream
            )
        );
    }else{
        return connections;
    }
}


function traverseDownStream(link){
    var connections = [[link.source.name, link.target.name]];
    if(link.target){
        return connections.concat(
            traverse(
                link.target.sourceLinks,
                traverseDownStream
            )
        );
    }else{
        return connections;
    }
}

function getAllNodePairs(node){

    var upstreamLinks = traverse(
        node.targetLinks,
        traverseUpStream
    );
    var downstreamLinks = traverse(
        node.sourceLinks,
        traverseDownStream
    );

    return upstreamLinks.concat(downstreamLinks);
}

function getAllNodePairsForLink(link){

    var upstreamLinks = traverse(
        link.source.targetLinks,
        traverseUpStream
    );
    var downstreamLinks = traverse(
        link.target.sourceLinks,
        traverseDownStream
    );

    return [[link.source.name, link.target.name]].concat(upstreamLinks, downstreamLinks);
}


function forEachNodePair(nodePairs, action){
    var i, limit;
    for(i=0, limit=nodePairs.length; i<limit; i++){
        action(nodePairs[i]);
    }
}

function getLinkSelector(srcNodeName, targetNodeName){
    return 'path[data-source="' + srcNodeName + '"][data-target="' + targetNodeName + '"]'
}




function highlightRelevantLabels(){

}



function onMouseEnterNode(event){
    forEachNodePair(
        getAllNodePairs(event),
        function(nodePair){
            d3.select(getLinkSelector(nodePair[0], nodePair[1]))
                .attr('class', 'active link');
        }
    );
}

function onMouseLeaveNode(event){
    forEachNodePair(
        getAllNodePairs(event),
        function(nodePair){
            d3.select(getLinkSelector(nodePair[0], nodePair[1]))
                .attr('class', 'link');
        }
    );
}


function onMouseEnterLink(event){
    forEachNodePair(
        getAllNodePairsForLink(event),
        function(nodePair){
            d3.select(getLinkSelector(nodePair[0], nodePair[1]))
                .attr('class', 'active link');
        }
    );
}

function onMouseLeaveLink(event){
    forEachNodePair(
        getAllNodePairsForLink(event),
        function(nodePair){
            d3.select(getLinkSelector(nodePair[0], nodePair[1]))
                .attr('class', 'link');
        }
    );
}
