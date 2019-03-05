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

function computeToProtein(seq){
    seq = seq.toUpperCase();
    var proteinStrand = [];
    for(i=0; i<seq.length; i)
    {
        var section = seq.slice(i, i+=3);
        console.log(section);
        if(section in codon_dictionary)
        {
            console.log(codon_dictionary[section]);
            proteinStrand.push(codon_dictionary[section]);
        }
        else
        {
            return proteinStrand;
        }
    }
    return proteinStrand;
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

const aa_dictionary = { 
    "A": ["GCA","GCC","GCG","GCT"], 
    "C": ["TGC","TGT"], 
    "D": ["GAC", "GAT"],
    "E": ["GAA","GAG"],
    "F": ["TTC","TTT"],
    "G": ["GGA","GGC","GGG","GGT"],
    "H": ["CAC","CAT"],
    "I": ["ATA","ATC","ATT"],
    "K": ["AAA","AAG"],
    "L": ["CTA","CTC","CTG","CTT","TTA","TTG"],
    "M": ["ATG"],
    "N": ["AAC","AAT"],
    "P": ["CCA","CCC","CCG","CCT"],
    "Q": ["CAA","CAG"],
    "R": ["AGA","AGG","CGA","CGC","CGG","CGT"],
    "S": ["AGC","AGT","TCA","TCC","TCG","TCT"],
    "T": ["ACA","ACC","ACG","ACT"],
    "V": ["GTA","GTC","GTG","GTT"],
    "W": ["TGG"],
    "Y": ["TAC","TAT"],
   };

   const codon_dictionary = { 
    "GCA": "A",
    "GCC": "A",
    "GCG": "A",
    "GCT": "A",
    "TGC": "C",
    "TGT": "C",
    "GAC": "D",
    "GAT": "D",
    "GAA": "E",
    "GAG": "E",
    "TTC": "F",
    "TTT": "F",
    "GGA": "G",
    "GGC": "G",
    "GGG": "G",
    "GGT": "G",
    "CAC": "H",
    "CAT": "H",
    "ATA": "I",
    "ATC": "I",
    "ATT": "I",
    "AAA": "K",
    "AAG": "K",
    "CTA": "L",
    "CTC": "L",
    "CTG": "L",
    "CTT": "L",
    "TTA": "L",
    "TTG": "L",
    "ATG": "M",
    "AAC": "N",
    "AAT": "N",
    "CCA": "P",
    "CCC": "P",
    "CCG": "P",
    "CCT": "P",
    "CAA": "Q",
    "CAG": "Q",
    "AGA": "R",
    "AGG": "R",
    "CGA": "R",
    "CGC": "R",
    "CGG": "R",
    "CGT": "R",
    "AGC": "S",
    "AGT": "S",
    "TCA": "S",
    "TCC": "S",
    "TCG": "S",
    "TCT": "S",
    "ACA": "T",
    "ACC": "T",
    "ACG": "T",
    "ACT": "T",
    "GTA": "V",
    "GTC": "V",
    "GTG": "V",
    "GTT": "V",
    "TGG": "W",
    "TAC": "Y",
    "TAT": "Y"
   };