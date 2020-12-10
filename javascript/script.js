const gC = $('.grid-container');

const paramsObj = {};
const paramReg = /(\?|&)(\D|\d){1,}/;
const langPart = /(\?|&)lang=(\D|\d){1,}/;
let currLang;
let url = window.location.href;
let filePath;

function checkUrl(url){
	const currParam = paramReg.exec(url) ? paramReg.exec(url)[0] : null;
	paramsObj.student = null;
	paramsObj.lang = null;

	//get querystring
	function getParam(){
		if(currParam){
			currParam.replace(
				/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) { paramsObj[key] = value; }
			);
		}
		console.log(paramsObj);

		$('[data-altLang] span').removeClass('altLangOn');
		$('[data-altLang').each(function(){$(this).removeAttr('href')})
		switch (paramsObj.lang) {
			case null:
				currLang = 'ko'
				$('span[data-altLang-en]').addClass('altLangOn');
				if(paramsObj.student){
					let href = window.location.search;
					href = href.concat('&lang=en');
					href = paramReg.exec(href)[0]
					$('a[data-altLang=en]').attr('href', href);
				}else{
					$('a[data-altLang=en]').attr('href', '?lang=en');
				}
				$('a[data-altLang=en] span').addClass('altLangOn');
				break;
			case 'en':
				currLang = 'en'
				let href = window.location.href;
				href = href.replace(langPart,'');
				$('a[data-altLang=ko]').attr('href', href);
				$('a[data-altLang=ko] span').addClass('altLangOn');
				break;
			default:
				break;
		}
		console.log(currLang);
		return paramsObj;
	}

	//check pathname
	filePath = window.location.pathname;
	function getFilePath(path){
		switch (path) {
			case "/":
			//case "/Users/minuuuu/Google%20%EB%93%9C%EB%9D%BC%EC%9D%B4%EB%B8%8C/%ED%95%99%EA%B5%90/2020-2%20%EC%A1%B8%EC%97%85%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8/%EC%A1%B8%EC%97%85%EC%A0%84%EC%8B%9C%EC%9B%B9%ED%8C%80/digdeep/index.html" :
				pageIdx = 1;
				console.log(pageIdx)
				return pageIdx;

			case "/project":
				pageIdx = 2;
				console.log(pageIdx);
				return pageIdx;

			case '/credit':
				pageIdx = 3;
				console.log(pageIdx)
				return pageIdx;
			default: //window.location.href = "https://digdeep.works"
			console.log(pageIdx);

		}
	}

	getParam();
	getFilePath(filePath);
	//pageIdx = 1;

	console.log(currLang);
	console.log(pageIdx);
};

const renderMain = {
	gCstyle : {
		gridTemplateColumns : 'repeat(7, 1fr) 170px 170px'
	},
	tNstyle : { 
		outline : 'none', 
		borderLeft: 'none'
	},
	about : $('<div>').attr('class', 'item about').css('background',`url(\'../image/shovels.jpeg\') center center / contain no-repeat white`),
	info : $('<div>').attr('class', 'info hidden'),
	title : $('<p>').attr('class','title').text('Dig deep'),
	keynote : $('<p>'),
	jail : $('<div>').attr('class', 'jail'),

	attachHover : function(target, el){
		target.hover(()=>{
			el.toggleClass('hidden');
			el.toggleClass('showed');
		},()=>{
			el.toggleClass('hidden');
			el.toggleClass('showed');
		});

	},

	createDiv : function(data){
		console.log(this);
		gC.css(renderMain.gCstyle).append(this.about, this.jail);
		$('.titleName').css(this.tNstyle);
		this.about.append(this.info);
		this.info.append(this.title, this.keynote);
		for(const target of data){
			const item = $('<div>').attr('class', `item booth diggingDiv ${target[currLang].query}` ).appendTo(this.jail);
			const video = $('<video>').attr({
				type: 'video/mp4'
			}).prop({ 
				autoplay: true, muted: true, loop: true
			}).appendTo(item);
			const wrappingBlock = $('<div>').attr('class', 'wrappingBlock hidden').css('background',`linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(\'../image/thumbnail_${target['ko'].query}.jpg\') center center / cover no-repeat`).appendTo(item);
			const workLink = $('<a>').attr('class','personalLink spa').appendTo(wrappingBlock);
			this.attachHover(item, wrappingBlock);
		}
		this.attachHover(this.about, this.info);
	},

	fillDiv : function(data){
		if (currLang==='ko'){
			this.keynote.text('2020년, 준비를 마친 인부들이 이동을 시작했다. 오프라인에서 온라인으로, 전신의 움직임에서 손가락의 작은 움직임으로, 땅 위에서 픽셀 위로…. 수많은 변화 속에서 그들은 존재를 지속할 수 있는 무언가를 찾아 나섰다. 각자가 속한 그리드와 픽셀 위에서, 28명의 인부들은 삽을 들고 더 깊은 아래를 향해 웹 속을 파고든다. 그 끝에 발굴해낸 새로운 가능성과 존재의 조각이 궁금하다면, dig deep.')
		}else{	
			this.keynote.text('In 2020, after extensive preparation, workers began to move. From offline to online, from full-body movement to small finger movements, from the ground to pixels above... Amidst a multitude of changes, they longed to find that “something” (or quality) that will rest immortally. On top of the grid and pixels to which they correspond, twenty-eight members hold a shovel to dig deeper into the web. If you are curious about the new possibilities and pieces unearthed, dig deep.');
		}
		for(const target of data){
			const i = data.indexOf(target);
			$('video')[i].setAttribute('src', `video/${target[currLang].query}_300px.mp4`);
			const workLink = $('a.personalLink')[i];
			if(currLang === 'en'){
				workLink.setAttribute('href',`./project?student=${target[currLang].query}&lang=en`);
			}else{
				workLink.setAttribute('href', `./project?student=${target[currLang].query}`);
			}
			//append block tag
			const blockTitle = $('<span>').attr('class', 'title').text(target[currLang].title).appendTo(workLink);
			const nameBlock = $(`<div>`).attr('class', 'nameBlock').appendTo(workLink);

			//append span to nameBlock
			const tagName = $(`<span>`).attr('class','name').text(target[currLang].name).appendTo(nameBlock)
			const arrow = $(`<span>→<span>`).appendTo(nameBlock);
		}
	}
}

const renderProject = {
	gCstyle : {
		gridTemplateColumns : 'repeat(3, minmax(100px, 1fr)) repeat(5, minmax(0, 1fr)) 170px 170px;'
	},
	tNstyle : { 
		outline : '1px solid black', 
		borderLeft: '1px solid black'
	},
	findTargetData : (data)=>{
		const isTarget = function(el){
			if(el[currLang].query === paramsObj.student) return true;
		};
		const targetData = data.find(isTarget);
		return targetData;
	},
	urlAttr : {
		'href': ``,
		'title': ``,
		'target': 'blank',
		'style': 'font-style: italic'
	},
	leftPannel : $('<div>').attr('class', 'leftPannel'),
	personal : $('<div>').attr('class', 'personal item'),
	vidWrapper : $('<div>'),
	diggingVid : $('<video autoplay muted loop>').attr('type','video/mp4'),
	urlBox : $('<span>').attr('class', 'url').appendTo(this.personal),
	urlLink : $('<a>Digging location→</a>'),
	description : $('<div>').attr('class','description item'),
	descrBox : $('<div>').attr('class','descrBox'),
	descrText : $('<p>').attr('data-detect','description'),
	stickyWrapper : $('<div>').attr('class','stickyWrapper item'),
	stickyBox : $('<div>'),
	stickyImg : (data)=>{
		for(let i=0; i<2; i++){
			const spacer = $('<div>');
			spacer.attr('class','stick spacer').appendTo(stickyBox);

			if(i===1) break;

			for(let j = 0; j<6; j++){
				const stickImg = $('<div>');
				stickImg.attr('class', 'stick stick-img').css('background-image', `url(/image/sticky_${targetData[currLang].query}_${j+1}.png)`).appendTo(stickyBox);
			}
		}
	},
	sortedData : function(data){Methods.sortData(data)},
	index : $('<div>').attr('class', 'index item'),
	indexCreate : function(data){
		$('.index').empty();
		//const sortedData = Methods.sortData(data);
		for(let i = 0; i<28; i++){
			$('<a>').attr('class', `indexA index${i}`).appendTo($('.index'));
		}

	},
	indexFill : function(data){
		$.each(this.sortedData(data),(i, item)=>{
			let indexLink = $('a.indexA')[i];
			indexLink.classList.remove('clicked')
			if(currLang === 'en'){
				indexLink.setAttribute('href','?student='+item['en'].query+'&lang=en');
			}else{
				indexLink.setAttribute('href','?student='+item['ko'].query);
			}
			indexLink.setAttribute('class',`${item['ko'].query} indexSpa`);
			indexLink.innerhtml(`<p>${item[currLang].name}</p>`);
			if(item[currLang].query === paramsObj.student){
				console.log(item[currLang].query);
				Methods.styleClicked(indexLink);
			}
		})
	},

	createDiv : function(){
		$('div').scrollTop(0);
		gC.css(this.gCstyle).append(this.leftPannel, this.stickyWrapper, this.index);
		$('.titleName').css(this.tNstyle);
		this.personal.appendTo(this.leftPannel).append(this.vidWrapper, this.urlBox);
		this.diggingVid.appendTo(this.vidWrapper)
		this.urlLink.appendTo(this.urlBox)
		this.descrBox.appendTo(this.description).append(this.descrText)
		this.stickyBox.appendTo(this.stickyWrapper);
	},

	fillDiv : function(data){
		const targetData = this.findTargetData(data);
		this.urlAttr.href = `https://${targetData[currLang].url}`;
		this.urlAttr.title = targetData[currLang].name;
		this.urlLink.attr(this.urlAttr);
		Methods.styleClickable(this.urlAttr);
		this.diggingVid.attr('src', `video/${targetData[currLang].query}_750px.mp4`);
		let changeList = Array.prototype.slice.call($('[data-detect]'))
		changeList.map(v=>{
			v.innerHTML = targetData[currLang][v.dataset.detect]
		});
		this.stickyImg(data);
		this.indexFill(data)
	}
}


const renderCredit = {
	gCstyle : {
		gridTemplateColumns : 'repeat(8, minmax(0, 1fr)) 170px 170px',
		gridTemplateRows: '3fr 1fr'
	},
	tNstyle : { 
		outline : 'none', 
		borderLeft: 'none'
	},
	infoSidebar : $('<div>').attr('class', 'infoSidebar'),
	personalInfo : $('<div>').attr('class', 'personalInfo item'),
	touchMe : $('<span>').attr('class','touchMe').text('Click a name!'),
	personalImg : $('<div>').attr('class', 'personalImg item'),
	shovel : $('<div>').attr('class','shovel'),
	diggingman : $('<video>').attr('type','video/mp4').prop({ 
		autoplay: true, muted: true, loop: true
	}),
	infoWrapper : $('<div>').attr('class', 'infoWrapper'),
	whichTeam : $('<div>').attr('class', 'whichTeam'),
	whichUrl : $('<div>').attr('class', 'whichUrl'),
	insta : $('<div>').attr('class', 'insta'),
	contact : $('<div>').attr('class', 'contact'),
	teamList : $('<div>').attr('class', 'teamList'),
	creditAbout : $('<div>').attr('class', 'creditAbout item'),
	div1 : $('<div>').attr('class','div1'),
	div2 : $('<div>').attr('class','div2'),
	div3 : $('<div>').attr('class','div3'),
	advisorDiv : $('<div>'),
	advisor : $('<span>').attr('class','duty'),
	seok : $('<span>').attr('class','inCharge'),
	sponsorDiv : $('<div>'),
	sponsor : $('<span>').attr('class','duty'),
	hivcd : $('<span>').attr('class','inCharge'),
	title : $('<p>').attr('class','title').text('Dig deep'),
	keynote : $('<p>'),

	createDiv : function(){
		gC.css(this.gCstyle).append(this.infoSidebar, this.teamList, this.creditAbout);
		$('.titleName').css(this.tNstyle);
		this.infoSidebar.append(this.personalInfo);
		this.personalInfo.append(this.touchMe);
		this.infoWrapper.append(this.whichTeam, this.whichUrl, this.insta, this.contact);
		this.whichTeam.append($('<span>')).append($('<span>'));
		this.whichUrl.append($('<a>'));
		this.insta.append($('<span>')).append($('<span>'));
		this.contact.append($('<span>')).append($('<span>'));
		this.creditAbout.append(this.div1, this.div2, this.div3);
		this.div1.append(this.advisorDiv, this.sponsorDiv);
		this.advisorDiv.append(this.advisor, this.seok)
		this.div2.append(tiitle, keynote);
		this.sponsorDiv.append(this.sponsor, this.hivcd);

		$('.insta span:first-child').text('instagram');
		$('.contact span:first-child').text('e-mail');

	},

	fillDiv : function(data){
		for(let i = 0; i<4; i++){
			const dataOfTeam = data[i][currLang]
			const team = $('<div>').attr('class', `team team${i+1} item`).appendTo(this.teamList);
			const teamName = $('<span>').attr('class', 'teamName').text(dataOfTeam.name).appendTo(team);
			//팀 내 역할별 순회
			for(let j in dataOfTeam.roleList){
				const dataOfRole = dataOfTeam.roleList 
				let indexJ = Object.keys(dataOfRole).indexOf(j);
				const roleDiv = $('<div>').attr('class','roleBlock').appendTo(team);
				const role = $('<span>').attr('class', 'duty').text(Object.keys(dataOfRole[indexJ])).appendTo(roleDiv);
				console.log(dataOfRole);
				//역할별 이름 채워넣기
				for(let k in dataOfRole[j]){
					const target = dataOfRole[j][k];
					const roleName = $('<span>').attr('class', 'inCharge').text(target.name).appendTo(roleDiv);
					if(currLang==='en'){
						roleName.css('flex','1 1 100%');
					}
					this.clickEvent(roleName, target);
				}
				//add name click eventlistener
				$('.teamList').not('span.inCharge.clicked').click(()=>{
					$('.touchMe ~ div').remove();
					$('.inCharge').removeClass('clicked');
					$('.touchMe').css('display', 'block');
					this.shovel.css('display','block');
					this.diggingman.css('display','none');
				});
			}
	
		}
	},
	clickEvent : (el, target)=>{
		el.click((e)=>{
			e.stopPropagation();

			if(!el.hasClass('clicked')){
				Methods.styleClicked(el);
				//video src 끼워넣기
				shovel.css('display','none');
				//diggingman.css('display', 'block').attr('src', `/video/${target.name}.mp4`)
				diggingman.css('display', 'block').attr('src', `/video/${target.query}_750px.mp4`)//샘플

				//선택자 하이라이트, 인포창 띄우기
				$('.infoWrapper').remove();
				$('span').not(this).removeClass('clicked');
				$('.touchMe').css('display', 'none');
				this.infoWrapper.appendTo(this.personalInfo)
				$('.whichTeam span:first-child').text(`${target.team} ${target.role}`);
				$('.whichTeam span:last-child').text(target.name);
				$('.whichUrl a').text(target.url).attr({
					'href': `https://${target.url}`, 
					'target': 'blank'
				});
				Methods.styleClickable($('.whichUrl a'));
				$('.insta span:last-child').text(target.personalUrl);
				$('.contact span:last-child').text(target.email);
				(()=>{
					$(".infoWrapper").multilingual([
						'en', 'num'
					]);
				})();
				(Methods.makeMultilingual($(".infoWrapper")))();
			}
		})
	}
}


function getData(url){
	return new Promise((res, rej)=>{
		const data = $.get(url, (d)=>{console.log(d)});
		res(data);
	})
};

const route = {
	'1': async () => {
		await getData('https://minw0525.github.io/digdeep_final/data/json1_main.json')
			.then((res) => {
				renderMain.createDiv(res);
				renderMain.fillDiv(res);
			})
	},
	'2': async () => {
		await getData('https://minw0525.github.io/digdeep_final/data/json2_project.json')
			.then((res) => {
				renderProject.createDiv();
				renderProject.fillDiv(res);
			})	
	},
	'3': async () => {
		await getData('https://minw0525.github.io/digdeep_final/data/json3_credit.json')
			.then((res) => {
				renderCredit.createDiv();
				renderCredit.fillDiv(res);
			})	
	},
	otherwise(path){
		$('body').innerHTML = `${path} Not Found`;
	}
};


function router(path) {
	(route[path] || route.otherwise)(path);
}

const load = (url)=>{
	gC.empty();
	$('span[data-detect]').empty();
	checkUrl(url);
	router(pageIdx);
	(()=>{
		console.log(currLang);
		$('.hrefConcatLang').each(function(){
			if(currLang === 'en'){
				this.href = this.href.concat('?lang=en');
			}
		})
	})()
}
load(url);


const Methods = {
	sortData : (data)=>{
		let sortedData = Array.from(data);
		sortedData.sort(function(a, b) {
			const nameA = a[currLang].name;
			const nameB = b[currLang].name;
			if (nameA < nameB) {
				return -1;
			}
			if (nameA > nameB) {
				return 1;
			}		  
			// 이름이 같을 경우
			return 0;
		});
		return sortedData;
	},
	styleClickable : (el)=>{
		el.classList.add('clickable')
	},
	styleClicked : (el)=>{
		el.classList.add('clicked')
	},
	styleHover : (el)=>{
		el.classList.add('hover')
	},
	makeMultilingual: (el)=>{
		el.multilingual([
			'en', 'num'
		]);
	}
}