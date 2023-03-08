function Algorithm() {

    this.player = 'P';
    this.otherPlayer = null;

    var rows = 6;
    var columns = 7;

    var gameBoard = null;

    var maxLevel = 4;

    this.move = function (availableColumns, gameBoard) {
        this.gameBoard = gameBoard;
        this.otherPlayer = this.getOtherPlayer(this.player);

        if( this.otherPlayer ) {
            var move = this.minmaxWithAlphaBetaPruning(this.getAvailableMoves(), true, maxLevel, 0, 0);
            return move.move;
        }else{
            return 3;
        }
    };

    this.getAvailableMoves = function() {
        var moves = [];
        for(var c=0; c<columns; c++) {
            if( this.getPlace(c, 0)==null ) {
                moves.push(c);
            }
        }
        return moves;
    };

    this.isPlayerAt = function(column, row, currentPlayer) {
        var place = this.getPlace(column, row);
        return place!=null && (place==this.player)==currentPlayer;
    };

    this.getPlace = function(column, row) {
        return this.gameBoard[column][row];
    };

    this.setPlace = function(column, row, player) {
        this.gameBoard[column][row] = player;
    };

    this.doMove = function(column, player) {
        for(var r=rows-1; r>=0; r--) {
            if( this.getPlace(column, r)==null ) {
                this.setPlace(column, r, player);
                return
            }
        }
    };

    this.undoMove = function(column) {
        for(var r=0; r<rows; r++) {
            if( this.getPlace(column, r)!=null ) {
                this.setPlace(column, r, null);
                return
            }
        }
    };

    this.isVictory = function(currentPlayer) {
        var r, c;
        for( r=rows-1; r>=0; r-- ) {
            for( c=0; c<columns; c++ ) {

                if( this.isPlayerAt(c, r, currentPlayer) ) {
                    // vertical
                    var isWin = true;
                    var count;
                    for( count=0; count<4 && (r-count)>=0 && isWin; count++ ) {
                        isWin = this.isPlayerAt(c, r-count, currentPlayer);
                    }
                    if( isWin && count==4 ) {
                        return true
                    }
                    // horizontal
                    isWin = true;
                    for( count=0; count<4 && (c+count)<columns && isWin; count++ ) {
                        isWin = this.isPlayerAt(c+count, r, currentPlayer);
                    }
                    if( isWin && count==4 ) {
                        return true
                    }
                    // diagonal 
                    isWin = true;
                    for( count=0; count<4 && (r-count)>=0 && (c+count)<columns && isWin; count++ ) {
                        isWin = this.isPlayerAt(c+count, r-count, currentPlayer);
                    }
                    if( isWin && count==4 ) {
                        return true
                    }
                    // anti diagonal
                    isWin = true;
                    for( count=0; count<4 && (r-count)<rows && (c-count)>=0 && isWin; count++ ) {
                        isWin = this.isPlayerAt(c-count, r-count, currentPlayer);
                    }
                    if( isWin && count==4 ) {
                        return true
                    }
                }
            }
        }
        return false;
    };

    this.getOtherPlayer = function(player) {
        for( var r=0; r<rows; r++ ) {
            for( var c=0; c<columns; c++) {
                var place = this.getPlace(c, r);
                if( place!=null && place!=player ) {
                    return place;
                }
            }
        }
        return null;
    };

    this.getGameBoardAsString = function() {
        var playerId = 'P';
        var opponentId = 'O';
        var rowsStrings = [];
        for( var r=0; r<rows; r++ ) {
            var row = [];
            for(var c=0; c<columns; c++ ) {
                var place = this.getPlace(c, r);
                if( place==this.player ) {
                    row.push( playerId );
                }
                else if( place!=null ) {
                    row.push( opponentId );
                }
                else row.push( ' ' );
            }
            rowsStrings.push( '|'+row.join('|')+'|' );
        }
        return rowsStrings.join('\n');
    };

    this.parseGameBoard = function(theRows) {
        var c, r;
        var gameBoard = [];
        for(c=0; c<columns; c++) {
            gameBoard.push([]);
            for(r=0; r<rows; r++) {
                gameBoard[c].push([]);
            }
        }
        for(c=0; c<columns; c++) {
            for(r=0; r<rows && r<theRows.length; r++) {
                var pos = theRows[r].replace(/\|/g, "").charAt(c);
                if( pos != ' ' ) {
                    gameBoard[c][r] = pos;
                }
                else {
                    gameBoard[c][r] = null;
                }
            }
        }
        return gameBoard;
    };

    this.getNewGameBoard = function() {
        var c, r;
        var gameBoard = [];
        for(c=0; c<columns; c++) {
            gameBoard.push([]);
            for(r=0; r<rows; r++) {
                gameBoard[c].push(null);
            }
        }
        return gameBoard;
    };


    this.minmaxWithAlphaBetaPruning = function(availableMoves, currentPlayer, level, min, max) {

        if(availableMoves.length==0 || level<=0 || this.isVictory(currentPlayer) ) {
            var score = this.gameScore(currentPlayer, level);
            return {score:score, move:null};
        }
        var best = {score:Number.NEGATIVE_INFINITY, move:null};
        for( var i=0; i<availableMoves.length; i++ ) {
            var currentMove = availableMoves[i];

            if( best.score > min ) {
                min = best.score;
            }
            this.doMove( currentMove, currentPlayer? this.player : this.otherPlayer );

            var theMove = this.minmaxWithAlphaBetaPruning(this.getAvailableMoves(), !currentPlayer, level-1, -max, -min);
            theMove = {score:-theMove.score, move:theMove.move};

            this.undoMove( currentMove );

            if(theMove.score > best.score) {
                best.score = theMove.score;
                best.move = currentMove;
            }
            if(best.score > max) {
                break;
            }
        }
        return best;
    };

    this.gameScore = function(currentPlayer, level) {
        if( this.isVictory(currentPlayer) ) {
            if( currentPlayer ) {
                return 10000;
            }
            else {
                return 20000;
            }
        }
        else {
            return this.getGameScore(currentPlayer);
        }
    };

    this.evaluatePlaces = function(places, isCurrentPlayer) {
        if( places.length!=4 && places.length!=5 ) {
            return 0
        }
        var nullCount = 0;
        var playerCount = 0;
        var opponentCount = 0;
        for(var i=0; i<places.length; i++) {
            if( places[i]==null ) {
                nullCount++;
            }
            else if( places[i]==this.player ) {
                if( isCurrentPlayer ) {
                    playerCount++;
                }
                else {
                    opponentCount++;
                }
            }
            else {
                if( isCurrentPlayer ) {
                    opponentCount++;
                }
                else {
                    playerCount++
                }
            }
        }
        if( places.length==5 && opponentCount!=0 ) {
            // | |P|P|P| |
            if( playerCount==3 && places[1]!=null && places[2]!=null && places[3]!=null ) {
                return 40;
            }
            // |P|P| |P| |
            if( playerCount==3 && places[0]!=null && places[1]!=null && places[3]!=null ) {
                return 30;
            }
            // | |P|P| |P|
            if( playerCount==3 && places[1]!=null && places[2]!=null && places[4]!=null ) {
                return 30;
            }
            // |P| |P|P| |
            if( playerCount==3 && places[0]!=null && places[2]!=null && places[3]!=null ) {
                return 30;
            }
            // | |P| |P|P|
            if( playerCount==3 && places[1]!=null && places[3]!=null && places[4]!=null ) {
                return 30;
            }
            // | |P| |P| |
            if( playerCount==2 && places[1]!=null && places[3]!=null ) {
                return 30;
            }
        }

        if( opponentCount!=0 ) {
            return 0;
        }
        else {
            if( playerCount==1 ) {
                return 1;
            }
            if( playerCount==2 ) {
                return 4;
            }
            if( playerCount==3 ) {
                return 8;
            }
            return playerCount;
        }
    };

    this.getGameScore = function(isCurrentPlayer) {
        var score = 0;
        var r, c;
        for( r=rows-1; r>=0; r-- ) {
            for( c=0; c<columns; c++ ) {

                    var count;
                    var places = [];

                    // vertical
                    for( count=0; count<=4 && (r-count)>=0; count++ ) {
                        places.push( this.getPlace(c, r-count) );
                    }
                    score += this.evaluatePlaces(places, isCurrentPlayer);


                    // horizontal
                    var places = [];
                    for( count=0; count<5 && (c+count)<columns; count++ ) {
                        places.push( this.getPlace(c+count, r) );
                    }
                    score += this.evaluatePlaces(places, isCurrentPlayer);


                    // diagonal 
                    for( count=0; count<4 && (r-count)>=0 && (c+count)<columns; count++ ) {
                        places.push( this.getPlace(c+count, r+count) );
                    }
                    score += this.evaluatePlaces(places, isCurrentPlayer);


                    // anti diagonal
                    for( count=0; count<4 && (r-count)<rows && (c-count)>=0; count++ ) {
                        places.push( this.getPlace(c-count, r-count) );
                    }
                    score += this.evaluatePlaces(places, isCurrentPlayer);
            }
        }
        return score;
    };
}
