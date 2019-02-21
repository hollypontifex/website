//if paired highlight the seq
//highlight path 

var nussinov = (function () {
    "use strict";
    var mSelf = null,
        mCurrentPath = [],
        mPathTable = [],
        mCellMap = {},
        mTopSequence = "",
        mSideSequence = "",
        mDomGridTable = null,
        mDomAlignmentTable = null,
        mDomContainer = null,
        mDomResultContainer = null,
        mGapSymbol = "-",
        mGapScore = 0,
        mMinLoopLength = 1,
        mBifurLocation = null;

    
    function isPair(seq, i, j)
    {
        if ((seq[i] == 'A' && seq[j] == 'U') || (seq[i] == 'C' && seq[j] == 'G') || (seq[i] == 'G' && seq[j] == 'U') || 
        (seq[i] == 'U' && seq[j] == 'G') || (seq[i] == 'U' && seq[j] == 'A') || (seq[i] == 'G' && seq[j] == 'C'))
        {
            return true;
        }
        return false;
    }

    function zeros(dimensions) {
        var array = [];
    
        for (var i = 0; i < dimensions[0]; ++i) {
            array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
        }
    
        return array;
    }

    function constructNRow(n) {

        var $table = $('#grid');
        var charIndex = parseInt(n, 10);
        var $tr = $('<tr />');
        var $th = null;

        if (charIndex >= 0) {
            $th = $('<th />')
                .addClass("seq-header")
                .addClass("side-header")
                .attr('id', 'side_seq_' + charIndex)
                .html(mSideSequence[charIndex]);
            $tr.append($th);
        } else {
            $th = $('<th />');
            $tr.append($th);
        }

        for (var idx in mTopSequence) {
            idx = parseInt(idx, 10);
            var dataPointIndex = (charIndex) + '_' + (idx);
            
            var $td = $('<td />')
                .html(mCellMap[dataPointIndex].winningScore)
                .attr('data-x', (idx))
                .attr('data-y', (charIndex))
                .attr('id', dataPointIndex);
            $tr.append($td);
        }

        $table.append($tr);
        mDomContainer.append($table);

    }

    function constructGrid() {

        $('#alignment').remove();
        $('#grid').remove();
        var $table = $('<table />').attr('id', 'grid');
        mDomGridTable = $table;
        mDomContainer.append($table);

        var $tr = $('<tr />');

        var $th = $('<th />');
        //$tr.append($th); 

        $th = $('<th />');
        $tr.append($th);

        for (var idx in mTopSequence) {
            $th = $('<th />');
            $th.attr('id', 'top_seq_' + idx);
            $th.addClass("seq-header");
            $th.addClass("top-header");
            $th.html(mTopSequence[idx]);
            $tr.append($th);
        }

        $table.append($tr);

        for (var i = 0; i < mSideSequence.length; i++) {
            constructNRow(i);
        }
    }

    function drawStructure(seq, pairs){
        console.log('drawing structure');
        var length = seq.length;
        var alignment = [];
        $('#alignment').remove();

        var $table = $('<table />').attr('id', 'alignment');
        mDomAlignmentTable = $table;
        var $tr = $('<tr />');
        for(var i = 0; i< length; i++){
            if ($.inArray(i, $.map(pairs, function(v) { return v[0]; })) > -1) {
                alignment.push('(');
            }
            else if ($.inArray(i, $.map(pairs, function(v) { return v[1]; })) > -1) {
                alignment.push(')');
            }
            else
            {
                alignment.push('.');
            }

        }
        $tr.append($('<td />').html(seq));
        
        $table.append($tr);

        $tr = $('<tr />');

        $table.append($tr);
        $tr.append($('<td />').html(alignment).attr('id', 'structure'));

        $tr = $('<tr />');
        $table.append($tr);

        mDomResultContainer.append($table);
    }

    function traceBack(seq){
        var stack = [];
        var pairs = [];
        stack.push(seq.length-1);
        stack.push(0);
        while(stack.length > 0)
        {
            console.log(stack);
            var i = stack.pop();
            var j = stack.pop();
            var dataPointIndex = (i) + '_' + (j);
            var value = mCellMap[dataPointIndex].direction;
            if(i >=j)
            {
                continue;
            }
            else if(value === 'p')
            {
                console.log(seq[i], seq[j]);
                pairs.push([i,j]);
                stack.push(j-1);
                stack.push(i+1);
            }
            else if (value === 'l')
            {
                stack.push(j);
                stack.push(i+1);
            }
            else if (value === 'r')
            {
                stack.push(j-1);
                stack.push(i);
            }
            else if (value !== null) 
            {
                stack.push(j);
                stack.push(value+1);
                stack.push(value);
                stack.push(i);
            }
        }
        drawStructure(seq, pairs);
    }


    mSelf = {

        rebuildTable: function(domContainer, resultContainer, minLoopLength, seq) {
            seq = seq.toUpperCase();
            mCurrentPath = [];
            mDomContainer = domContainer;
            mDomResultContainer = resultContainer;
            mTopSequence = seq;
            mSideSequence = seq;
            mMinLoopLength = minLoopLength;

            var length = seq.length;


            mPathTable = zeros([length, length]);
            for(var i=0; i < length; i++)
            {
                for(var j = 0; j < length; j++)
                {
                    mCellMap[i + "_" + j] = {
                        'winningScore': mPathTable[i][j],
                        //'direction': null
                    };
                }
            }

            for (var l = mMinLoopLength+1; l < length; l++) {
                for (var i = 0; i < length-l; i++) {

                    var j = i + l;
                
                    var pair = isPair(seq, i, j) ? mPathTable[i+1][j-1] + 1 : -100;
                    var left  = mPathTable[i+1][j];
                    var right = mPathTable[i][j-1];
                    var bifur = -100;
                    for (var k = i; k < j; k++)
                    {
                        if (mPathTable[i, k] + mPathTable[k + 1, j] > bifur)
                        {
                            bifur = mPathTable[i, k] + mPathTable[k + 1, j];
                            mBifurLocation = k;
                        }
                    }
                    
    
                    mPathTable[i][j] = Math.max(pair, left, right, bifur);
                    var direction;

                    if (mPathTable[i][j] === left) {
                        direction = 'l';
                    }
                                        
                    else if (mPathTable[i][j] === right) {
                        direction= 'r';
                    }

                    else if (mPathTable[i][j] === bifur) {
                        direction = mBifurLocation;
                    }

                    else if(mPathTable[i][j] === pair){
                        direction = 'p';
                    }
                    
                    mCellMap[i + "_" + j] = {
                        'winningScore': mPathTable[i][j],
                        'direction': direction
                    }
                }
            }
            console.log(mPathTable);
            console.log(mCellMap);
            console.log('constructing grid');
            constructGrid();

            //console.log('tracing back');
            traceBack(seq);
        }

    };

    return mSelf;

}());