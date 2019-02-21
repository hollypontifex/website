var smithWaterman = (function () {
    "use strict";
    //Some instance variables
    //var mIsFirstCall = true,
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
        mMatchScore = 0,
        mMismatchScore = 0,
        mGapScore = 0,
        mHighScoreI = null,
        mHighScoreJ = null,
        mHighScore = 0;
        
    function onCellClicked(dom, x, y) {

        x = parseInt(x, 10);
        y = parseInt(y, 10);

        var lastElement = null;
        
        if (mCurrentPath !== null && mCurrentPath.length !== 0) {

            lastElement = mCurrentPath[mCurrentPath.length - 1];

            if (dom.hasClass('in-path')) {
                if (mCurrentPath.length === 1) {
                    mCurrentPath[0].dom.removeClass('in-path');
                    mCurrentPath[0].dom.removeClass('is-last');
                    mCurrentPath[0].dom.removeAttr('data-index');
                    mCurrentPath = [];
                    onPathUpdate();
                    return true;
                }

                var indexInPath = parseInt(dom.attr('data-index'), 10);
                for (var i = indexInPath + 1; i < mCurrentPath.length; i++) {
                    mCurrentPath[i].dom.removeClass('in-path');
                    mCurrentPath[i].dom.removeClass('is-last');
                    mCurrentPath[i].dom.removeAttr('data-index');
                }
                mCurrentPath.splice(indexInPath + 1, mCurrentPath.length - indexInPath + 1);
                mCurrentPath[mCurrentPath.length - 1].dom.addClass('is-last');
                onPathUpdate();
                return true;
            }

            //An attempt to move in the wrong direction
            if (lastElement.x < x || lastElement.y < y) {
                return false;
            }

            if (x - lastElement.x < -1 || y - lastElement.y < -1) {
                return false;
            }
        }

        dom.attr('data-index', mCurrentPath.length);

        mCurrentPath.push({
            'idx': mCurrentPath.length,
            'x': x,
            'y': y,
            'dom': dom,
            'previous': lastElement
        });

        if (lastElement) {
            lastElement.dom.removeClass('is-last');
        }

        dom.addClass('is-last');
        dom.addClass('in-path');
        onPathUpdate();
        return true;

    }

    function onPathUpdate() {

        var alignedTopSeq = '';
        var alignedSideSeq = '';

        //$('th').removeClass('included');
        
        for (var i = mCurrentPath.length - 1; i >= 0; i--) {

            var currentCell = mCurrentPath[i];
            var nextCell = (i > 0) ? mCurrentPath[i - 1] : null;

            var topChar = mTopSequence[currentCell.x];
            var sideChar = mSideSequence[currentCell.y];
            
            if (!nextCell) {
                continue;
            }

            if(topChar){
                if(currentCell.x != nextCell.x){
                    $('#top_seq_' + (currentCell.x)).addClass('included');
                }
            }

            if(sideChar){
                if(currentCell.y != nextCell.y){
                    $('#side_seq_' + (currentCell.y)).addClass('included');
                }
            }

            //Diagonal move
            if (nextCell.x - currentCell.x > 0 && nextCell.y - currentCell.y > 0) {
                alignedTopSeq += topChar;
                alignedSideSeq += sideChar;
                continue;
            }

            //Horizontal move
            if (nextCell.x - currentCell.x > 0) {
                sideChar = mGapSymbol;
            }

            //Vertical move
            if (nextCell.y - currentCell.y > 0) {
                topChar = mGapSymbol;
            }

            alignedTopSeq += topChar;
            alignedSideSeq += sideChar;
        }

        $('#alignment').remove();

        var $table = $('<table />').attr('id', 'alignment');
        mDomAlignmentTable = $table;
        //mDomAlignmentTable.width( mDomGridTable.width() );

        var score = 0;
        var $tr = $('<tr />');
        for (var idxTop in alignedTopSeq) {
            var c1 = alignedTopSeq[idxTop];
            var c2 = alignedSideSeq[idxTop];

            if (c1 === mGapSymbol || c2 === mGapSymbol) {
                score += mGapScore;
            } else if (c1 === c2) {
                score += mMatchScore;
            } else {
                score += mMismatchScore;
            }
            $tr.append($('<td />').html(c1));
        }
        $table.append($tr);

        $tr = $('<tr />');
        for (var idxSide in alignedSideSeq) {
            $tr.append($('<td />').html(alignedSideSeq[idxSide]));
        }
        $table.append($tr);

        $tr = $('<tr />');
        $tr.append($('<td colspan="1500" class="score" />').html("Score = " + score));
        $table.append($tr);

        mDomResultContainer.append($table);

    }

    function getCssClassesFromDirection(directions) {
        
        var cssClasses = "";

        if(!Array.isArray(directions)){
            return cssClasses;
        }

        cssClasses = directions.join(' ');

        return cssClasses;
        
    }

    function constructNRow(n) {

        var $table = $('#grid');
        var charIndex = parseInt(n, 10) - 1;
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

        var $td = $('<td />')
            .html(mCellMap[0 + "_" + n].winningScore)
            .attr('data-x', 0)
            .attr('data-y', n)
            .attr('id', 0 + "_" + n);
        $tr.append($td);

        for (var idx in mTopSequence) {
            idx = parseInt(idx, 10);
            var dataPointIndex = (idx + 1) + '_' + (charIndex + 1);
            
            var cssClasses = "";
            if(n > 0){
                cssClasses = getCssClassesFromDirection(mCellMap[(idx+1) + "_" + (charIndex+ 1)].direction);
            }

            $td = $('<td />')
                .addClass(cssClasses)
                .html(mCellMap[dataPointIndex].winningScore)
                .attr('data-x', (idx + 1))
                .attr('data-y', (charIndex + 1))
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
        $tr.append($th); 

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

        for (var i = 0; i < mSideSequence.length + 1; i++) {
            constructNRow(i);
        }
    }


    mSelf = {
        highlightOptimal: function() {
            var width = mTopSequence.length + 1;
            var height = mSideSequence.length + 1;

            var currentX = mHighScoreI;
            var currentY = mHighScoreJ;
            while (direction != 'r' && (currentX > -1 && currentY > -1)) {

                var currentCell = mCellMap[currentX + '_' + currentY];
                var currentDom = $('#' + currentX + '_' + currentY);

                onCellClicked(currentDom, currentDom.attr('data-x'), currentDom.attr('data-y'));
                
                var direction = null;
                if(currentCell.direction){
                    direction = currentCell.direction[currentCell.direction.length-1];
                }

                switch (direction) {
                    case 's':  currentX--;  break;
                    case 'u':  currentY--;  break;
                    default:
                    case 'd':
                        currentX--;
                        currentY--;
                        break;
                }
            }
        },

        rebuildTable: function(domContainer, resultContainer, matchScore, mismatchScore, gapScore, seqSide, seqTop) {
            seqTop = seqTop.toUpperCase();
            seqSide = seqSide.toUpperCase();
            mCurrentPath = [];
            mDomContainer = domContainer;
            mDomResultContainer = resultContainer;
            mTopSequence = seqTop;
            mSideSequence = seqSide;
            mMatchScore = matchScore;
            mMismatchScore = mismatchScore;
            mGapScore = gapScore;
            var resetScore = 0;

            var width = mTopSequence.length + 1;
            var height = mSideSequence.length + 1;

            for (var i = 0; i < width; i++) {
                mPathTable[i] = [];
                for (var j = 0; j < height; j++) {

                    if (i === 0 || j === 0) {
                        mPathTable[i][j] = 0;
                        mCellMap[i + "_" + j] = {
                            'winningScore': mPathTable[i][j]
                        };
                        continue;
                    }

                    var isMatch = mTopSequence[i - 1] === mSideSequence[j - 1];
                    var comparisonScore = isMatch ? matchScore : mismatchScore;
                    var moveUpScore = mPathTable[i][j - 1] + gapScore;
                    var moveSdScore = mPathTable[i - 1][j] + gapScore;
                    var moveDgScore = parseInt(comparisonScore, 10) + parseInt(mPathTable[i - 1][j - 1]);
                    
                    mPathTable[i][j] = Math.max(moveUpScore, moveSdScore, moveDgScore, resetScore);
                    
                    if(mPathTable[i][j] >= mHighScore)
                    {
                        mHighScore = mPathTable[i][j]
                        mHighScoreI = i;
                        mHighScoreJ = j;
                    }

                    var direction = [];

                    if(mPathTable[i][j] === moveDgScore){
                        direction.push('d');
                    }
                    
                    if (mPathTable[i][j] === moveUpScore) {
                        direction.push('u');
                    }
                    
                    if (mPathTable[i][j] === moveSdScore) {
                        direction.push('s');
                    }

                    if (mPathTable[i][j] === resetScore) {
                        direction.push('r');
                    }
                    
                    mCellMap[i + "_" + j] = {
                        'winningScore': mPathTable[i][j],
                        'direction': direction
                    };

                }
            }

            constructGrid();
        }

    };

    return mSelf;

}());