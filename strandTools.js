var mDomResultContainer = null;

function convertToRNA(seq){
    var rna = [];
    seq = seq.toUpperCase();
    console.log(seq);
    for(i=0; i<seq.length; i++)
    {
        if(seq[i]==='T')
        {
            rna.push('U');
        }
        else{
            rna.push(seq[i]);
        }
    }
    return rna;
}

function reverseStrand(seq){
    var rvsStrand = [];
    seq = seq.toUpperCase();
    for(i=seq.length-1; i>=0; i--)
    {
        rvsStrand.push(seq[i]);
    }
    seq = complementStrand(rvsStrand);
    return seq;
}

function complementStrand(seq){
    var compStrand = [];
    for(i=0; i<seq.length; i++)
    {
        if(seq[i]==='T')
        {
            compStrand.push('A');
        }
        if(seq[i]==='A')
        {
            compStrand.push('T');
        }
        if(seq[i]==='G')
        {
            compStrand.push('C');
        }
        if(seq[i]==='C')
        {
            compStrand.push('G');
        }
    }
    return compStrand;
}

function computeGCContent(seq){
    var count = 0;
    var percent = 0;
    for(i=0; i<seq.length; i++)
    {
        if(seq[i]==='G' || seq[i]==='C')
        {
            count = count + 1;
        }
    }
    percent = (count / seq.length) * 100 + '%';
    return percent;
}



function postResult(resultsContainer, seq){

    console.log('posting results');
    mDomResultContainer = resultsContainer;
    $('#alignment').remove();
    var $table = $('<table />').attr('id', 'alignment');
    mDomAlignmentTable = $table;
    var $tr = $('<tr />');
    $tr.append($('<td />').html(seq));
    
    $table.append($tr);
    mDomResultContainer.append($table);
}