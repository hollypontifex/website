var mDomResultContainer = null;

function convertToRNA(cont, resultContainer, seq){
    var rna = [];
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
    mDomResultContainer = resultContainer;
    postResult(rna);
}

function postResult(rna){
    $('#alignment').remove();

    var $table = $('<table />').attr('id', 'alignment');
    mDomAlignmentTable = $table;
    var $tr = $('<tr />');
    $tr.append($('<td />').html(rna));
    
    $table.append($tr);

    mDomResultContainer.append($table);
}