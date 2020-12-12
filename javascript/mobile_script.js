const gC = $('.grid-container');

const paramsObj = {};
const paramReg = /(\?|&)(\D|\d){1,}/;
const langPart = /(\?|&)lang=(\D|\d){1,}/;
let currLang;
let url = window.location.href;
let filePath;
let pageIdx = 1

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
			case "/mobile.html":
					pageIdx = 1;
					console.log(pageIdx)
					return pageIdx;
		
			case "/mobile/project":
				pageIdx = 2;
				console.log(pageIdx);
				return pageIdx;

			case '/mobile/credit':
				pageIdx = 3;
				console.log(pageIdx)
				return pageIdx;
			default: //window.location.href = "https://digdeep.works"
			console.log(pageIdx);

		}
	}

	getParam();
	getFilePath(filePath);
	pageIdx = 3;

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
	placeholder : $('<div>').attr('class', 'item booth diggingDiv placeholder'),
	jail : $('<div>').attr('class', 'jail'),

	createDiv : function(data){
		console.log(this);
		gC.css(renderMain.gCstyle);
		this.jail.css(this.jailStyle).appendTo(gC);
		for(const target of data){
			const item = $('<div>').attr('class', `item booth diggingDiv ${target[currLang].query}` ).appendTo(this.jail);
			const video = $('<video>').attr({
				type: 'video/mp4'
			}).prop({ 
				autoplay: true, muted: true, loop: true, playsinline: true
			}).appendTo(item);
			const wrappingBlock = $('<div>').attr('class', 'wrappingBlock hidden').css('background',`linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(\'../image/thumbnail_${target['ko'].query}.jpg\') center center / cover no-repeat`).appendTo(item);
			const workLink = $('<a>').attr('class','personalLink spa').appendTo(wrappingBlock);
			Methods.attachHover(item, wrappingBlock);
		}
	},

	fillDiv : function(data){
		for(const target of data){
			const i = data.indexOf(target);
			$('video')[i].setAttribute('src', `../video/${target[currLang].query}_300px.mp4`);
			const workLink = $('a.personalLink')[i];
			if(currLang === 'en'){
				workLink.setAttribute('href',`project?student=${target[currLang].query}&lang=en`);
			}else{
				workLink.setAttribute('href', `project?student=${target[currLang].query}`);
			}
			//append block tag
			const blockTitle = $('<span>').attr('class', 'title').text(target[currLang].title).appendTo(workLink);
			const nameBlock = $(`<div>`).attr('class', 'nameBlock').appendTo(workLink);

			//append span to nameBlock
			const tagName = $(`<span>`).attr('class','name').text(target[currLang].name).appendTo(nameBlock)
			const arrow = $(`<span>→<span>`).appendTo(nameBlock);
		}
		document.querySelector('video').play();
	}
}



const renderProject = {
	gCstyle : {
		display: 'grid',
		gridTemplateColumns : 'repeat(3, 1fr)',
		gridTemplateRows : 'repeat(6, 1fr)'
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
	urlLink : $('<span>Digging location →</span>').attr('class', 'url'),
	description : $('<div>').attr('class','description item'),
	descrBox : $('<div>').attr('class','descrBox'),
    descrText : $('<p>').attr('data-detect','description'),
    
    
	createDiv : function(data){
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
		this.diggingVid.attr('src', `../video/${targetData[currLang].query}_750px.mp4`);
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
				renderMain.createDiv(res);
				renderMain.fillDiv(res);
			})
	},
	'2': async () => {
		await getData('https://minw0525.github.io/digdeep_final/data/json2_project.json')
			.then((res) => {
				renderProject.createDiv(res);
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

function load(url){
	$('.grid-container *').each((i,e)=>{
		e.remove();
	});
	$('span[data-detect]').empty();
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
			'en', 'num'
		]);
	}
}

// a tag onclick pushstate event
$(document).on('click', 'a.spa', function(e) {
	$(this).attr('disabled',true);
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
