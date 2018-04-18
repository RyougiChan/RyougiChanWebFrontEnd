(function () {

    var $chatContent = $('.chat-content'),
        $chatSelectBtn = $('.chat-select_btn'),
        $chatSelectCont = $('.chat-select_cont'),
        chatCount = 0,
        preId = undefined,
        vname,
        stop = false,
        curRoleCont,
        curRoleSelCont,
        preCont = [
            "欢迎访问!",
            "Happy Girl's Day!",
            "敝姓张。",
            "那么，你是谁呢？"
        ],
        JingYiCont = {
            '5.1':'我知道了，你的名字是陆婧怡吧。',
            '5.2':'emmm...那就称呼你为$NAME$さん吧。',
            '6.1':'你还是我那个的小师妹吗(*￣3￣)╭',
            '6.2':"Happy Girl's Day!(If you are a girl) 虽然可能我们未曾相识，但是我依旧期待你的光临，<br>祝愿：<br>手如柔荑，<br>肤如凝脂，<br>领如蝤蛴，<br>齿如瓠犀。<br>螓首蛾眉，<br>巧笑倩兮，<br>美目盼兮。",
            '8.1':'听到这个回答，我感动的眼泪掉下来(￣y▽￣)╭ Ohohoho.....',
            '8.2':'是这样的吗？恭喜选中死亡选项。(￢︿̫̿￢☆)',
            '9.1':'现在学业是不是很繁重？',
            '9.2':'Game Over. You have losed.',
            '11.1':'(ง •_•)ง加油！注意劳逸结合，遇到困难多和朋友谈谈心，也可以和我聊聊，我很乐意倾听朋友们的倾诉。',
            '11.2':'那挺好的，不要弄得太累',
            '12':'现在周末还有经常过来深圳吗？',
            '14.1':'之前你来深圳没去和你叙叙旧真是遗憾呢(⓿_⓿)，找个时间你来深圳了我请你吃个饭。',
            '14.2':'这样。看来你在 HK 的生活变得丰富多彩的了。在大学多交几个知心朋友，以后出来不再深造离开学校之后，就不会太孤独了。<br>要不找个周天我过去 HK， 咱可以见见面啊叙叙啊。',
            '15':'你觉得如何？',
            '17.1':'OK，一般情况下我会双休，所以什么时候你有时间，微信问我或者打电话给我(这个可以微信问我)，不过要提前一点。',
            '17.2':'(;´༎ຶД༎ຶ`)悲しい。',
            '18':"女生节快乐！小仙女永远 18 岁~ 拜拜ヾ(•ω•`)o"
        },
        JingYiSelectCont = {
            '4':[true,'那么，你是谁呢？'],
            '7':['是的', '不是，哼(这一看就是个死亡选项)'],
            '10':['是', '不是'],
            '13':['有', '没有'],
            '16':['棒极了！', '还是算了吧'],
        },
        JieChunCont = {
            //以前我总是尽量避免不必要的社交，小年轻的时候中二病太重，总以为什么事都能自己解决，有一点小成绩常会沾沾自喜。现在回想起来，算是祖宗积德我才能在孤僻中走到现在吧。<br>然而，学得越多，经历得越多，越是感觉自己其实一无所知。因此，<bold>我想改变，哪怕要花很长时间。</bold>
            '5.1':'我知道了，你的名字是林洁纯吧。',
            '5.2':'emmm...那就称呼你为$NAME$さん吧。',
            '6.1':'你好啊，欢迎光临(好像没什么不对)。<br>首先呢，我想问一个问题：有空我约你出来，会不会对你造成困扰？',
            '6.2':"Happy Girl's Day!(If you are a girl) 虽然可能我们未曾相识，但是我依旧期待你的光临，<br>祝愿：<br>手如柔荑，<br>肤如凝脂，<br>领如蝤蛴，<br>齿如瓠犀。<br>螓首蛾眉，<br>巧笑倩兮，<br>美目盼兮。",
            '8.1':'怎么说呢，看到你选了这个选项，内心还是有点开心的吧φ(゜▽゜*)♪',
            '8.2':'是这样啊，也是，虽然说我们认识有十年左右了，但是我们之间的交集并不是很多。总的来说呢是我的一些个人原因引起的一个问题吧。事实上，就我而言，能交心的朋友屈指可数，连现在身处一个屋檐下的室友，也不能谈得上能互相理解。大概就像是——熟悉的陌生人这样吧。',
            '9.1':'话说，我们认识已经十年有余了吧。真的是时间荏苒啊，韶华白首，不过转瞬。现在工作还会很忙吗？',
            '9.2':'那么，如果想成为你的好朋友，我应该怎样做呢？请务必告诉我。<br>现在工作还会很忙吗？',
            '11.1':'感觉我也不好说什么，感觉处在这个社会中总有那么点身不由己，只能跟你打打气了，(ง •_•)ง加油！有什么难以解决的烦恼，只要是我能帮上忙的，我很乐意。',
            '11.2':'那挺好的，感觉你之前一直都是处于箭在弦上的状态，一定很累吧',
            '12':'我思考过一个问题，在同年级的大家眼里，我到底是个什么的人？大致上你如何看呢？',
            '14.1':'没想到还有这么好的评价，我自己觉得我倒有点像"问题儿童"，关于这个问题，其实我以前问过身边一些人的看法(6666)，得到的回答大多是不直接评价，额...所以我很想和你聊一聊的。',
            '14.2':'emmm...得到这个评价的话，我自己能想到的原因大概和他人的原因有很大的出入吧，所谓当局者迷，旁观者清。所以，如果是这样的话，我很想和你聊一聊(当然我不知道你是否选了这一项)。',
            '15':'你觉得可以吗？',
            '17.1':'感谢ヽ(✿ﾟ▽ﾟ)ノ',
            '17.2':'(。﹏。*)此时应该表现得失落一点吧。感谢你能坚持到这里。',
            '18':"最后，女生节快乐！<br>And 我想说，我喜欢你(所以喜欢到底为何物呢？)~ 拜拜ヾ(•ω•`)o"
        },
        JieChunSelectCont = {
            '4':[true,'那么，你是谁呢？'],
            '7':['不会', '会'],
            '10':['是，忙', '不是很忙'],
            '13':['瑕不掩瑜', '让人想敬而远之'],
            '16':['可以啊，很乐意', '算了吧，很困扰'],
        },
        LiPingCont = {
            '5.1':'我知道了，你的名字是罗丽苹吧。',
            '5.2':'emmm...那就称呼你为$NAME$さん吧。',
            '6.1':'你好啊，欢迎光临(好像没什么不对)。<br>首先呢，我想无耻问一句：有没有感觉很惊喜呢？',
            '6.2':"Happy Girl's Day!(If you are a girl) 虽然可能我们未曾相识，但是我依旧期待你的光临，<br>祝愿：<br>手如柔荑，<br>肤如凝脂，<br>领如蝤蛴，<br>齿如瓠犀。<br>螓首蛾眉，<br>巧笑倩兮，<br>美目盼兮。",
            '8.1':'怎么说呢，看到你选了这个选项，内心还是有点开心的吧φ(゜▽゜*)♪，毕竟这是我的第一次尝试',
            '8.2':'是这样啊...怎么说呢，要是我知道你选了这个，应该内心还是会失落的吧',
            '9.1':'话说，你今年就要毕业了吧。现在学业如何？',
            '9.2':'不过，算了哈，没什么大不了的。现在学业如何？',
            '11.1':'恭喜恭喜？，无论就业还是深造，都请加油加油(ง •_•)ง！',
            '11.2':'emmm...这个时候的压力确实会比较大，我有一个读双学位的室友雅思考不过结果失去了出国深造的机会，之前有一段时间还找我谈心了。感觉一到面临大选择的时候，难免会很焦躁(话说之前临近毕业的时候我也是这种感受)。<br>我建议，先解决好情绪再解决事情。有什么难以解决的烦恼，只要是我能帮上忙的，我很乐意。',
            '12':'質問：この先輩はどんな人ですか？',
            '14.1':'没想到还有这么好的评价，我自己觉得我倒有点像"问题儿童"，关于这个问题，其实我以前问过身边一些人的看法(6666)，得到的回答大多是不直接评价。',
            '14.2':'emmm...得到这个评价的话，我自己能想到的原因大概和他人的原因有很大的出入吧，所谓当局者迷，旁观者清。哎...好在意啊。',
            '15':'编剧本好难啊，我觉得可以结束了, Can I?',
            '17.1':'感谢ヽ(✿ﾟ▽ﾟ)ノ',
            '17.2':'(。﹏。*)已过劳死。',
            '18':"最后，女生节快乐！对了，明信片我 6 号收到了，感谢！拜拜ヾ(•ω•`)o"
        },
        LiPingSelectCont = {
            '4':[true,'那么，你是谁呢？'],
            '7':['会啊，很惊喜', '一般吧，没什么大不了的'],
            '10':['一切顺利', '不太顺利'],
            '13':['いい先輩です', '普通に'],
            '16':['YES，辛苦了', 'Oh, 不！等等'],
        };

    $chatSelectBtn.on('click', function (e) {
        e.preventDefault();
        if(preId) return;
        $chatSelectCont.html('');
        if(chatCount == 4) {
            addSelect(JingYiSelectCont['4']);
        } else {
            if(!stop && curRoleSelCont[chatCount+'']) addSelect(curRoleSelCont[chatCount+'']);
        }
        $chatSelectCont.css('bottom', 0);
    });
    
    $('body').delegate('.chat-select_cont p', 'click', function(e){
        e.preventDefault();
        addChat(vname, $(this).html());
        $chatSelectCont.css('bottom', '');
        var rp = $(this).attr('data-opt') == 'true' ? true : false;
        setTimeout(function(){
            if(rp == 1) {
                addReply(chatCount + '.1');
            } else {
                addReply(chatCount + '.2');
            }

            setTimeout(function(){
                if(!stop && (curRoleCont[chatCount] || curRoleCont[chatCount + '.1'] || curRoleCont[chatCount + '2'])) {
                    curRoleCont[chatCount] ? addReply(chatCount) : rp ? addReply(chatCount + '.1') : addReply(chatCount + '.2');
                }

                if(!rp && chatCount == 10 && curRoleCont == JingYiCont) {
                    stop = true;
                    chatCount = -1;
                    console.log("死亡选项");
                };

                preId = undefined;
            }, 2000);
        }, 2000);
    });

    $('body').delegate('.chat-select_cont .yuko-button', 'click', function(e){
        e.preventDefault();
        var inputVal = $('.chat-select_cont .yuko-textfield_input').val().trim();
        if(inputVal == '') {
            inputVal = $('.chat-select_cont .yuko-textfield_input')[1].value.trim();
        }
        if(!vname) {
            switch(inputVal) {
                case '婧怡':
                case '陆婧':
                case '陆婧怡':
                vname = '陆婧怡';
                curRoleCont = JingYiCont;
                curRoleSelCont = JingYiSelectCont;
                break;
                case '洁纯':
                case '林洁':
                case '林洁纯':
                vname = '林洁纯';
                curRoleCont = JieChunCont;
                curRoleSelCont = JieChunSelectCont;
                break;
                case '丽苹':
                case '罗丽':
                case '罗丽苹':
                vname = '罗丽苹';
                curRoleCont = LiPingCont;
                curRoleSelCont = LiPingSelectCont;
                break;
                default:
                vname = inputVal;
                curRoleCont = JingYiCont;
                curRoleSelCont = JingYiSelectCont;
                break;
            }
        };
        addChat(vname, inputVal);
        $chatSelectCont.css('bottom', '');
        setTimeout(function(){
            if(vname == '陆婧怡' || vname == '林洁纯' || vname == '罗丽苹') {
                addReply(chatCount+'.1');
            } else {
                addReply(chatCount+'.2');
            }
            setTimeout(function(){
                if (vname == '陆婧怡' || vname == '林洁纯' || vname == '罗丽苹') {
                    addReply(chatCount + '.1')
                } else {
                    addReply(chatCount + '.2');
                    stop = true;
                    chatCount = -1;
                }
                preId = undefined;
            }, 2000);
        }, 2000);
    });

    
    $(document).ready(function () {
        var i = 0;
        preId = setInterval(function () {
            if(preCont[i]) {
                addChat('Nyan',preCont[i]);
                i++;
            }else{
                clearInterval(preId);
                preId = undefined;
            }
        }, 2000);
    });

    function addChat(avatar, cont) {
        var msg = (avatar == 'Nyan' ?  '<div class="chat-msg">' : '<div class="chat-msg chat-msg_mine">' ) + ('<div class="chat-avatar">' + avatar +'</div>'
        + '<div class="chat-text">' + cont + '</div></div>');
        $chatContent.append(msg);
        chatCount++;
        $chatContent[0].scrollTop = $chatContent[0].scrollHeight;
        $chatContent[1].scrollTop = $chatContent[1].scrollHeight;
    }

    function addReply(replyId) {
        preId = 1;
        if(chatCount == 5) {
            addChat('Nyan', curRoleCont[replyId+''].replace('$NAME$', vname));
        }else {
            addChat('Nyan', curRoleCont[replyId+'']);
        }
    }

    function addSelect(select){
        var sel = '';
        if(select[0] === true) {
            sel = '<div class="yuko-textfield yuko-js-textfield">'
                + '<input class="yuko-textfield_input" type="text" name="yuko-input1">'
                + '<label class="yuko-textfield_label" for="yuko-input1">'+'</label>'
                + '</div>'
                + '<div class="yuko-button yuko-button_ripple yuko-button_null yuko-button_colored">'
                + '<i class="">Commit</i>'
                + '<span class="ripple show"></span>'
                + '</div>'
        }else{
            sel += '<p data-opt="true">' + select[0] + '</p>';
            sel += '<p data-opt="false">' + select[1] + '</p>';
        }
        $chatSelectCont.html('');
        $chatSelectCont.append(sel);
    }

})();