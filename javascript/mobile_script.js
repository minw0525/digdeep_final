let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

const gC = $('.grid-container');

const paramsObj = {};
const paramReg = /(\?|&)(\D|\d){1,}/;
const langPart = /(\?|&)lang=(\D|\d){1,}/;
let currLang;
let url = window.location.href;
let filePath;
let pageIdx = 1
let tempdata;

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
			case "/mobile":
			case "/mobile/":
			case "/digdeep_final/mobile":
			case "/digdeep_final/mobile/":
				pageIdx = 1;
				console.log(pageIdx)
				return pageIdx;
		
			case "/mobile/project":
			case "/digdeep_final/mobile/project":
			case "/digdeep_final/mobile/project/":
				pageIdx = 2;
				console.log(pageIdx);
				return pageIdx;
			default: 
			//	window.location.href = "https://digdeep.works"
			console.log(pageIdx);

		}
	}

	getParam();
	getFilePath(filePath);
//	pageIdx = 2;

	console.log(currLang);
	console.log(pageIdx);
};


const renderMain = {
	gCstyle : {
		display: 'block',
		gridTemplateRows : 'unset',
		gridTemplateColumns : 'unset',
	},
	jailStyle : {
		display: 'grid',
		gridTemplateRows : 'repeat(auto-fill, minmax(100px, auto))',
		gridTemplateColumns : 'repeat(3, 1fr)',
	},
	dropdownStyle : {
		display: 'none'
	},
	dropdown : $('.dropdown'),
	placeholder : $('<div>').attr('class', 'item booth diggingDiv placeholder'),
	jail : $('<div>').attr('class', 'jail'),

	createDiv : function(data){
		console.log(this);
		this.dropdown.css(this.dropdownStyle);
		gC.css(renderMain.gCstyle);
		this.jail.css(this.jailStyle).appendTo(gC);
		for(const target of data){
			const item = $('<div>').attr('class', `item booth diggingDiv ${target[currLang].query}` ).appendTo(this.jail);
			const video = $('<video>').attr({
				type: 'video/mp4',
				playsinline:''
			}).prop({ 
				autoplay: true, muted: true, loop: true
			}).appendTo(item);
			const wrappingBlock = $('<div>').attr('class', 'wrappingBlock hidden').css('background',`linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(\'../image/thumbnail_${target['ko'].query}.jpg\') center center / cover no-repeat`).appendTo(item);
			const workLink = $('<a>').attr('class','personalLink spa').appendTo(wrappingBlock);
			workLink.css('display','none');
			this.clickEvent(item, wrappingBlock, workLink);
		}
	},

	fillDiv : function(data){
		for(const target of data){
			const i = data.indexOf(target);
			$('video')[i].setAttribute('src', `../video/${target[currLang].query}_300px.mp4`);
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
			const arrow = $(`<span>→</span>`).appendTo(nameBlock);
			const tagName = $(`<span>`).attr('class','name').text(target[currLang].name).appendTo(nameBlock)
		}
		Methods.makeMultilingual(gC);

		$('video').each(function(i,el){
			el.play()
		})
	},

	clickEvent : (el, target1, target2)=>{
		el.click(function(e){
			e.stopPropagation();
			console.log(this)
			if(!target1.hasClass('showed')){
				$('.wrappingBlock').each(function(i,e){
					e.classList.remove('showed');
					e.classList.add('hidden');
					e.children[0].style.display='none';
				})
				target2.css('display','flex');
				target1.toggleClass('hidden')
				target1.toggleClass('showed')
				target2.toggleClass('cilcked');
			}
		})
	}
	
}



const renderProject = {
	gCstyle : {
		display: 'grid',
		gridTemplateColumns : 'repeat(3, 1fr)',
		gridTemplateRows : 'repeat(6, 1fr)'
	},

	dropdownStyle : {
		display: 'none'
	},
	dropdown : $('.dropdown'),

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
    stickyWrapper : $('<div>').attr('class','stickyWrapper item'),
    stickyBox : $('<div>'),
    titleName : $('<div>').attr('class','titleName item'),
    title: $('<span>').attr({
        'class': 'title',
        'data-detect': 'title'
    }),
    name: $('<span>').attr({
        'class': 'name',
        'data-detect': 'name'
    }),
	personal : $('<div>').attr('class', 'personal item'),
	vidWrapper : $('<div>'),
	diggingVid : $('<video autoplay muted playsinline loop>').attr('type','video/mp4'),
	urlBox : $('<a>'),
	urlLink : $('<span>Visit website →</span>').attr('class', 'url'),
	description : $('<div>').attr('class','description item'),
	descrBox : $('<div>').attr('class','descrBox'),
    descrText : $('<p>').attr('data-detect','description'),
    
    
	createDiv : function(data){
		this.dropdown.css(this.dropdownStyle);
		gC.css(this.gCstyle).append(this.stickyWrapper, this.titleName, this.personal, this.description);
        this.stickyWrapper.append(this.stickyBox);
        this.titleName.append(this.title, this.name);
        this.personal.append(this.urlBox, this.vidWrapper);
		this.diggingVid.appendTo(this.vidWrapper);
		this.urlBox.append(this.urlLink);
		this.descrBox.appendTo(this.description).append(this.descrText)
	},
	stickyImg : function(data){
		console.log(currLang);
		const targetData = this.findTargetData(data);
		this.stickyBox.empty();
		const spacer = $('<div>');
		spacer.attr('class','spacer').appendTo(this.stickyBox);
		for(let j = 0; j<6; j++){
			const stickImg = $('<div>');
			stickImg.attr('class', 'stick stick-img').appendTo(this.stickyBox);
			if(j===5){
				stickImg.addClass('clickable').click(function(){
					window.open(`https://${targetData[currLang].url}`)	
				})
			}
		}
		
    },
    index: $('.index'),
	indexCreate : function(data){
        //renderProject에 bind하기
		const sortedData = Methods.sortData(data);
		$(this.index).empty();
		//const sortedData = Methods.sortData(data);
		$.each(sortedData,(i, item)=>{
			const indexName = $('<p>').attr({
				class : 'indexName',
				id: item['en'].query
            }).appendTo($(this.index));
            
            const name = $('<span>').text(item[currLang].name)
            const title= $('<title>').text(item[currLang].title)
            const indexLink = $('<a>').attr('class','indexSpa').appendTo(indexName).append(name, title);
			if(currLang === 'en'){
				indexLink.attr('href','?student='+item['en'].query+'&lang=en');
			}else{
				indexLink.attr('href','?student='+item['en'].query);
			}
		})
	},
	//z
	indexHighlight : function(){
		$('.indexName').each((i, item)=>{
			item.classList.remove('clicked');
			if(item.getAttribute('id') === paramsObj.student){
				Methods.styleClicked(item);
			}})
	},
	fillDiv : function(data){
		$('.stickyWrapper').scrollTop(0);
		const targetData = this.findTargetData(data);
		console.log(targetData)
		this.urlAttr.href = `https://${targetData[currLang].url}`;
		this.urlAttr.title = `https://${targetData[currLang].url}`;
		this.urlBox.attr(this.urlAttr);
		Methods.styleClickable(this.urlLink[0]);
		this.diggingVid.attr('src', `../video/${targetData[currLang].query}_300px.mp4`);
		let changeList = Array.prototype.slice.call($('[data-detect]'))
		changeList.map(v=>{
			v.innerHTML = targetData[currLang][v.dataset.detect]
		});
		this.stickyImg(data);
		$('.stick-img').each(function(i, e){
			e.style.backgroundImage=`url(../image/sticky_${targetData[currLang].query}_${i+1}.png)`
		})
		this.indexHighlight();
		document.querySelector('video').play();
	},
	onlyProjectFill : function(href, data){
		href.replace(
			/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) { paramsObj[key] = value; }
		);
		console.log(paramsObj);
		this.fillDiv(data);

		const ko = $('a[data-altLang=ko]');
		const en = $('a[data-altLang=en]');
		if(currLang === 'ko'){
			en[0].href = `?student=${paramsObj.student}&lang=en`
		}else if(currLang === 'en'){
			ko[0].href = `?student=${paramsObj.student}`
		}
		Methods.makeMultilingual(gC);
	}
}


const renderCredit = {
	gCstyle : {
		display: 'none'
	},
	
	dropdownStyle : {
		display: 'block',
		padding: '0',
	},
	dropdown : $('.dropdown'),
	spacer: $('<div>'),
	personalInfo: $('<div>').attr('class','personalInfo item'),
	touchMe: $('<span>').attr('class','touchMe').text('Touch a name!'),
	info: $('<div>').attr('class','info'),
	email: $('<span>').attr('class','email'),
	insta: $('<span>').attr('class','insta'),
	workUrl: $('<span>').attr({
		'class':'workUrl',
	}),
	videoWrap: $('<div>').attr('class','videoWrap'),
	video: $('<video>').prop({
		autoplay: true,
		muted: true,
		loop: true
	}).attr({
		type: 'video/mp4',
		playsinline: ''
	}),
	sponsor: $('<div>').attr('class','sponsor item'),

	icon1 : $('<div>').attr('class','icon'),
	icon2 : $('<div>').attr('class','icon'),
	icon3 : $('<div>').attr('class','icon'),
	emaildata: $('<span>').attr('data-detect','email'),
	instadata: $('<span>').attr('data-detect','personalUrl'),
	pageLink : $('<a>').attr('data-detect','url'),
	createDiv: function(){
		//gC.css(this.gCstyle);
		this.dropdown.empty();
		this.dropdown.css(this.dropdownStyle)
		this.sponsor.empty();
		console.log('emptied')
		this.dropdown.append(this.personalInfo, this.sponsor);
		console.log('dropdownStyled')
		$('.credit').addClass('clickedGnb');
		this.personalInfo.append(this.touchMe, this.videoWrap, this.info);
		this.info.append(this.email, this.insta, this.workUrl);
		this.email.append(this.icon1, this.emaildata)
		this.insta.append(this.icon2, this.instadata);
		this.workUrl.append(this.icon3, this.pageLink);
		this.videoWrap.append(this.video);
		for(let i = 0; i<2; i++){
			const teamName = $('<div>').attr('class','teamName').appendTo(this.sponsor);
			for(let j = 0; j<2; j++){
				$('<span>').attr('class','school').appendTo(teamName);
			}
		};
		for(let i = 0; i<4; i++){
			$('<div>').attr('class',`team team${i} item`).appendTo(this.dropdown);
		}
	},
	fillDiv: function(data){
		this.touchMe.css('display', 'block');
		//this.touchMe.css('display', 'none');
		$('.touchMe ~ div').css('display','none');

		for(const [i,el] of data.entries()){
			const teamName = $('<span>').attr('class','teamName').appendTo($('.team')[i])
			teamName.html(el[currLang].name);
			const roleList = el[currLang].roleList;
			for(let j in roleList){
				console.log(roleList[j])
				const roleBlock = $('<div>').attr('class','roleBlock').appendTo($('.team')[i])
				$('<span>').attr('class','duty').text(j).appendTo(roleBlock);//duty
				const nameList = $('<div>').attr('class','nameList').appendTo(roleBlock);
				const target = roleList[j]
				if(currLang === 'en')nameList.css('flex','1 1 40%')
				for(let k in target){
					const roleName = $('<span>').attr('class','inCharge').text(target[k].name).appendTo(nameList);
					this.clickEvent(roleName, target[k])
					if(currLang === 'en'){
						roleName.css('flex','1 1 100%');	
					}
				}
				//add name click eventlistener
				$('div').not('.info').click(()=>{
					//$('.touchMe ~ div').remove();
					$('.inCharge').removeClass('clicked');
					$('.touchMe').css('display', 'block');
					this.info.css('display','none');
					this.videoWrap.css('display','none');
				});
			}
		}
		if (currLang==='ko'){
			$('.school')[0].textContent = '지도 교수';
			$('.school')[1].textContent = '석재원';
			$('.school')[2].textContent = '주최';
			$('.school')[3].textContent = '홍익대학교 시각디자인과'
		}else{
			$('.school')[0].textContent = 'Professor';
			$('.school')[1].textContent = 'Jaewon Seok';
			$('.school')[2].textContent = 'Auspice';
			$('.school')[3].innerHTML = 'Hongik University <br>Visual Communication Design'
		}
	},
	clickEvent : (el, target)=>{
		el.click(function(e){
			e.stopPropagation();
			console.log(this)
			if(!el.hasClass('clicked')){
				Methods.styleClicked(el[0]);
				renderCredit.videoWrap.css('display', 'flex');
				renderCredit.video.attr('src', `../video/${target.query}_300px.mp4`)//샘플


				//선택자 하이라이트, 인포창 띄우기
				$('.info').css('display','block');
				$('span').not(this).removeClass('clicked');
				$('.touchMe').css('display', 'none');
				$('[data-detect=url]').attr({
					'href': `https://${target.url}`, 
					'target': 'blank'
				});
				let changeList = Array.prototype.slice.call($('[data-detect]'))
				const textpart = /[>][a-zA-Z0-0]{0,}[<]/
				changeList.map(v=>{
					console.log(v.innerHTML)
					$(v).text(target[v.dataset.detect]);
				});
				Methods.styleClickable($('.workUrl a')[0]);
				$('.insta>span:last-child').text(target.personalUrl);
				$('.contact>span:last-child').text(target.email);
			}
			document.querySelector('video').play()
		})
	},
	removeCredit: function(){
		this.dropdown.css('display','none')
	}
}


const renderAbout = {
	gCstyle : {
		display: 'none',
	},
	
	dropdownStyle : {
		//display: 'block',
		padding: '20px 10px'
	},
	dropdown : $('.dropdown'),
	keynote : $('<p>').attr('class', 'keynote'),

	sponsor: $('<div>').attr('class','aboutSponsor'),
	sponsorInfo: $('<p>'),

	render: function(){
		//gC.css(this.gCstyle);
		this.dropdown.empty();
		if (currLang==='ko'){
			this.keynote.text('2020년, 준비를 마친 인부들이 이동을 시작했다. 오프라인에서 온라인으로, 전신의 움직임에서 손가락의 작은 움직임으로, 땅 위에서 픽셀 위로…. 수많은 변화 속에서 그들은 존재를 지속할 수 있는 무언가를 찾아 나섰다. 각자가 속한 그리드와 픽셀 위에서, 28명의 인부들은 삽을 들고 더 깊은 아래를 향해 웹 속을 파고든다. 그 끝에 발굴해낸 새로운 가능성과 존재의 조각이 궁금하다면, dig deep.')
			this.sponsorInfo.html('12.15 - 12.31 <br><a>2020 홍익대학교 시각디자인과 졸업주간</a> C반<br>지도교수 석재원').appendTo(this.sponsor)
		}else{	
			this.keynote.text('In 2020, after extensive preparation, workers began to move. From offline to online, from full-body movement to small finger movements, from the ground to pixels above... Amidst a multitude of changes, they longed to find that “something” (or quality) that will rest immortally. On top of the grid and pixels to which they correspond, twenty-eight members hold a shovel to dig deeper into the web. If you are curious about the new possibilities and pieces unearthed, dig deep.');
			this.sponsorInfo.html('12.15 - 12.31 <br><a>2020 Hongik University<br>Visual Communication Design <br>Graduation Week</a> Class C<br>Advisor : Jaewon Seok').appendTo(this.sponsor)		
		}
		this.dropdown.append(this.keynote, this.sponsor).css(this.dropdownStyle);
		$('.aboutSponsor a').attr({
			target: "blank",
			href: "http://www.hivcdgw2020.com/",
			class: "clickable"
		})
	}
}

const renderWorks = {
	gCstyle : {
		display: 'none',
	},
	
	dropdownStyle : {
		display: 'block',
		padding: '20px 10px'
	},
	dropdown : $('.dropdown'),

	render: function(data){
		//gC.css(this.gCstyle);
		this.dropdown.empty();

		this.dropdown.css(this.dropdownStyle).append(this.keynote, this.sponsor);
		for(el of data){
			console.log(el)
			const workLink = $('<a>').appendTo(this.dropdown)
			const indiv = $('<p>').attr('class','indiv').appendTo(workLink)
			$('<span>').appendTo(indiv).text(el[currLang].name);
			$('<span>').appendTo(indiv).text(el[currLang].title);
			if(currLang === 'en'){
				workLink.attr('href',`./project?student=${el[currLang].query}&lang=en`);
				$('.indiv > span:first-child').css('flex','1 1 80%')
			}else{
				workLink.attr('href', `./project?student=${el[currLang].query}`);
			}
		}
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
        await getData('https://minw0525.github.io/digdeep_final/data/json2_project.json')
			.then((res) => {
				tempdata = Methods.sortData(res);
				renderMain.createDiv(res);
				renderMain.fillDiv(res);
			})
	},
	'2': async () => {
		await getData('https://minw0525.github.io/digdeep_final/data/json2_project.json')
			.then((res) => {
				tempdata = Methods.sortData(res);
				renderProject.createDiv(res);
				renderProject.fillDiv(res);
			})	
	},
	otherwise(path){
		$('body').innerHTML = `${path} Not Found`;
	}
};


function router(path) {
	(route[path] || route.otherwise)(path);
}

$('.gnb').each((i,el)=>{
	el.addEventListener('click',function(){
		console.log(this);
		const id = this.id;
		if(!this.classList.contains('clickedGnb')){
			gnbRoute(this)
		}else{
			$('.dropdown').stop().slideUp(500)
			gnbRemove(this)
		}
	})
})

async function gnbRoute(e){
	$('.gnb').not(e).removeClass('clickedGnb')
	const id = e.id;
	console.log(e);
	e.classList.add('clickedGnb')
	$('.dropdown').stop().slideDown(500)
	switch (id) {
		case "about":
			console.log('rendering about');
			renderAbout.render();
			break;
		case "works":
			console.log('rendering works')
			renderWorks.render(tempdata);
			break;
		case "credit":
			console.log('getting data');
			await getData('https://minw0525.github.io/digdeep_final/data/json3_credit.json')
				.then((res) => {
					renderCredit.createDiv();
					renderCredit.fillDiv(res);
				})
			break;
		default: 
			break;
	};
	Methods.makeMultilingual($('.dropdown'));
}
function gnbRemove(){
	$('.gnb').each((i,el)=>{
		el.classList.remove('clickedGnb');
		//$('.dropdown').css('display','none');
		gC.css('display','grid')
	})
}

function load(url){
	$('.grid-container *').each((i,e)=>{
		e.remove();
	});
	$('span[data-detect]').empty();
	gnbRemove();
	checkUrl(url);
	router(pageIdx);
	(()=>{
		console.log(currLang);
		$('.hrefConcatLang').each(function(){
			if(currLang === 'en'&&!langPart.exec(this.href)){
				this.href = this.href.concat('?lang=en');
			}
		})
	})()
    Methods.makeMultilingual(gC);
}


const Methods = {
	attachHover : function(target, el){
		target.hover(()=>{
			el.toggleClass('hidden');
			el.toggleClass('showed');
		},()=>{
			el.toggleClass('hidden');
			el.toggleClass('showed');
		});
	},
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
			'en'
		]);
		console.log('multilingualed');
	},
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
}


// a tag onclick pushstate event
$(document).on('click', 'a.spa', function(e) {
	$(this).attr('disabled',true);
	console.log('spa')
	e.preventDefault();
	let href = $(this).attr('href');
	console.log(href);
	history.pushState(href,'', href);
	url = window.location.href;
	load(url)
	$(this).removeAttr('disabled')
	return false;
});

// a tag onclick pushstate event
$(document).on('click', 'a.indexSpa', async function(e) {
	$(this).attr('disabled',true);
	e.preventDefault();
	let href = $(this).attr('href');
	console.log(href);
	history.pushState(href,'', href);
	await getData('https://minw0525.github.io/digdeep_final/data/json2_project.json')
		.then((res)=>{renderProject.onlyProjectFill(href, res)})
	$(this).removeAttr('disabled')
	return false;
});

//bind popstate event
$(window).bind('popstate', function() {
    let returnLocation = history.location || document.location;
    console.log(returnLocation)
    let href = returnLocation.search;
	load(href);
});


load(url);
setTimeout(loading, 0)//3000);
 function loading(){
	document.querySelector('#loadingBox').style.visibility='hidden';
}
