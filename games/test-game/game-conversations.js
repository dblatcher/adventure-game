import {Conversation, DialogBranch, DialogChoice} from '../../src/modules/conversation-constructors';


function makeConversations() {

    var conversations = {};
    conversations.withLuigi = new Conversation ('Talking to Luigi', "LUIGI_C",'start');

    conversations.withLuigi.addBranch (new DialogBranch(
        'start', [
            new DialogChoice ('Who are you?',
                ['LUIGI_C::Green Mario...','LUIGI_C::...also called Luigi.'],
                {canOnlySayOnce:true}),
            new DialogChoice ('Do you have a hammer?',
                ['LUIGI_C::Sure.',
                'LUIGI_C::swap it for the shoe.',
                '[get]HAMMER_I',
                '[loose]SHOE_I'
                 ],
                {condition: function(){return this.gameVars.wantsHammer}, canOnlySayOnce:true, disabled:false}),
            new DialogChoice ('Do you know anything about plumbing?',
                ['LUIGI_C::what do you want to know?'],
                {changesBranch:'plumbing'}),
            new DialogChoice ('can you dance?',
                ['LUIGI_C::Just watch!','LUIGI_C##dance']),
            new DialogChoice ('Let\'s play rock paper scissors',[],{changesBranch:'rockPaperScissors'}),
            new DialogChoice ('Goodbye',
                ['LUIGI_C::Bye Bye','pc##wave','LUIGI_C##walk'], 
                {ends:true})
        ]
    ));

    conversations.withLuigi.addBranch (new DialogBranch(
        'plumbing', [
            new DialogChoice ('What is a ballcock?',
                ['pc::What is a ball...','LUIGI_C::ballcock? its the thing that tells the toilet if it\'s ready to flush.'],
                {canOnlySayOnce:true,firstLineUnsaid:true}),
            new DialogChoice ('Never mind about plumbing...',
                ['pc##wave'], 
                {changesBranch:'start'})
        ]
    ));

    conversations.withLuigi.addBranch (new DialogBranch(
        'rockPaperScissors', [
            new DialogChoice ('rock',
                [ ['pc::rock','LUIGI_C::scissors'] ,'pc::I win!'],
                {firstLineUnsaid:true}),
            new DialogChoice ('paper',
                [ ['pc::paper','LUIGI_C::scissors'],'pc::you win!'],
                {firstLineUnsaid:true}),
            new DialogChoice ('scissors',
                [['pc::scissors','LUIGI_C::scissors'],['pc::a draw!','LUIGI_C::a draw!']],
                {firstLineUnsaid:true}),
            new DialogChoice ('no more.',
                [], 
                {changesBranch:'start'})
        ]
    ));

    return conversations
}

export default makeConversations;