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
			//case "/":
			case "/digdeep_final/" :
				pageIdx = 1;
				console.log(pageIdx)
				return pageIdx;

			case "/digdeep_final/project" :
				pageIdx = 2;
				console.log(pageIdx);
				return pageIdx;

			case "/digdeep_final/credit" :
				pageIdx = 3;
				console.log(pageIdx)
				return pageIdx;
			default: //window.location.href = "https://digdeep.works"
			console.log(pageIdx);

		}
	}

	getParam();
	getFilePath(filePath);
	console.log(currLang);
	console.log(pageIdx);
};

function renderMain(data){
	//gC[0].textContent = JSON.stringify(data)
	gC.attr('style','grid-template-columns: repeat(7, 1fr) 170px 170px');
	$('.titleName').css('outline', 'none')
	//$('.logo h1').css('grid-column','1/3');
	//$('.nameTag').remove();
	
	const about = $('<div>').attr('class', 'item about').css('background',`url(\'image/shovels.jpeg\') center center / contain no-repeat white`).appendTo(gC);
	const info = $('<div>').attr('class', 'info hidden').appendTo(about);
	about.hover(function(){
		info.toggleClass('hidden');
		info.toggleClass('showed');
		about.css('background','');
	},function(){
		info.toggleClass('hidden');
		info.toggleClass('showed');
		about.css('background', `url(\'image/shovels.jpeg\') center center / contain no-repeat white`);
	})
	const title = $('<p>').attr('class','title').text('Dig deep');
	const keynote = $('<p>');
	info.append(title, keynote);

	console.log(currLang);
	if (currLang==='ko'){
		keynote.text('2020년, 준비를 마친 인부들이 이동을 시작했다. 오프라인에서 온라인으로, 전신의 움직임에서 손가락의 작은 움직임으로, 땅 위에서 픽셀 위로…. 수많은 변화 속에서 그들은 존재를 지속할 수 있는 무언가를 찾아 나섰다. 각자가 속한 그리드와 픽셀 위에서, 28명의 인부들은 삽을 들고 더 깊은 아래를 향해 웹 속을 파고든다. 그 끝에 발굴해낸 새로운 가능성과 존재의 조각이 궁금하다면, dig deep.')
	}else{	
		keynote.text('In 2020, after extensive preparation, workers began to move. From offline to online, from full-body movement to small finger movements, from the ground to pixels above... Amidst a multitude of changes, they longed to find that “something” (or quality) that will rest immortally. On top of the grid and pixels to which they correspond, twenty-eight members hold a shovel to dig deeper into the web. If you are curious about the new possibilities and pieces unearthed, dig deep.');
	}
	

	const jail = $('<div>').attr('class', 'jail').appendTo(gC);
	for(let i = 0; i<28; i++){
		const item = $('<div>').attr('class', `item booth diggingDiv ${data[i][currLang].query}` ).appendTo(jail);
		//const video = $('<video>').attr({src: `video/${data[i]['ko'].name}.mp4`, type: 'video/mp4'}).prop({ autoplay: true, muted: true, loop: true,})
		const video = $('<video>').attr({src: `video/${data[i][currLang].query}_300px.mp4`, type: 'video/mp4'}).prop({ autoplay: true, muted: true, loop: true,})
		video.appendTo(item);//샘플

		const wrappingBlock = $('<div>').attr('class', 'wrappingBlock hidden').css('background',`linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(\'image/thumbnail_${data[i]['ko'].query}.jpg\') center center / cover no-repeat`).appendTo(item)
		console.log(currLang);
		// work link
		const workLink = $('<a>').attr('class','personalLink spa').appendTo(wrappingBlock);
		if(currLang === 'en'){
			workLink.attr('href',`./project?student=${data[i][currLang].query}&lang=en`);
		}else{
		workLink.attr('href', `./project?student=${data[i][currLang].query}`);
		}

		//append block tag
		const blockTitle = $(`<span>`).attr('class', 'title').text(data[i][currLang].title);
		const nameBlock = $(`<div>`).attr('class', 'nameBlock');
		workLink.append(blockTitle, nameBlock)

		//append span to nameBlock
		const tagName = $(`<span>`).attr('class','name').text(data[i][currLang].name)
		const arrow = $(`<span>→<span>`);
		nameBlock.append(tagName, arrow);


		//apply hover event
		item.hover(function(){
			wrappingBlock.toggleClass('hidden');
			wrappingBlock.toggleClass('showed');
		},function(){
			wrappingBlock.toggleClass('hidden');
			wrappingBlock.toggleClass('showed');
		})
	}
};

//###################################################################
//###################################################################
//###################################################################

function renderProject(data){
	$('div').scrollTop(0);
	let isTarget = function(el){
		if(el[currLang].query === paramsObj.student) return true;
	};
	let targetData = data.find(isTarget);
	console.log(targetData);
	
	gC.attr('style','grid-template-columns: repeat(3, minmax(100px, 1fr)) repeat(5, minmax(0, 1fr)) 170px 170px;');
	$('.titleName').css('outline', '2px solid black')
	//$('.logo h1').css('grid-column','1/2');
	//$('.nameTag').remove();

	//apply url box in header
	/*const logoBlock = $('.logo');

	const nameTag = $('<div>');
	nameTag.attr('class','nameTag item');
	const titleText = $('<span>');
	const nameText = $('<span>');
	titleText.attr({ 
		'class': 'title',
		'data-detect': 'title'
	});
	nameText.attr({
		'class': 'name',
		'data-detect': 'name'
	});
	
	logoBlock.append(nameTag);
	nameTag.append(titleText, nameText);

	*/
	//left pannel
	const leftPannel = $('<div>').attr('class', 'leftPannel').appendTo(gC);

	const personal = $('<div>');
	personal.attr('class', 'personal item');
	leftPannel.append(personal);
	const vidWrapper = $('<div>').appendTo(personal)

	//const diggingVid = $('<video autoplay muted loop>')
	const diggingVid = $('<video autoplay muted loop>').attr('src', `video/${targetData['ko'].query}_750px.mp4`).appendTo(vidWrapper);
	const urlBox = $('<span>').attr('class', 'url').appendTo(personal);

	const urlLink = $('<a>Digging location→</a>');
	urlLink.attr({
		'href': `https://${targetData[currLang].url}`,
		'title': `${targetData[currLang].name}`,
		'target': 'blank',
		'class': 'highlightOn',
		'style': 'font-style: italic'
	}).appendTo(urlBox);

	const description = $('<div>').attr('class','description item').appendTo(leftPannel);
	const descrBox = $('<div>').attr('class','descrBox').appendTo(description);
	const descrText = $('<p>').attr('data-detect','description').appendTo(descrBox);

	let changeList = Array.prototype.slice.call($('[data-detect]'))
	changeList.map(v=>{
		v.innerHTML = targetData[currLang][v.dataset.detect]
	})



	//sticky wrapper 
	const stickyWrapper = $('<div>');
	stickyWrapper.attr('class','stickyWrapper item').appendTo(gC);
	const stickyBox = $('<div>').appendTo(stickyWrapper);
	//append image loop
	for(let i=0; i<2; i++){
		const spacer = $('<div>')
		spacer.attr('class','stick spacer').appendTo(stickyBox);

		if(i===1) break;

		for(let j = 0; j<6; j++){
			const stickImg = $('<div>');
			stickImg.attr('class', 'stick stick-img').css('background-image', `url(image/sticky_${targetData[currLang].query}_${j+1}.png)`).appendTo(stickyBox);
		}
	}

	const index = $('<div>');
	index.attr('class', 'index item').appendTo(gC);
	indexFill(data);
	//fill index
	function indexFill(data){
		$('.index').empty();
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
		console.log(sortedData);
		$.each(sortedData,i=>{
			let indexLink = $('<a>');
			if(currLang === 'en'){
				indexLink.attr('href','?student='+sortedData[i]['en'].query+'&lang=en');
			}else{
				indexLink.attr('href','?student='+sortedData[i]['ko'].query);
			}
			indexLink.attr('class','spa');
			$('.index').append(indexLink);
			indexLink.html(`<p>${sortedData[i][currLang].name}</p>`);
			if(sortedData[i][currLang].query === paramsObj.student){
				console.log(sortedData[i][currLang].query);
				indexLink.addClass('highlightOn')
			}
		})
	}
};

//###################################################################
//###################################################################
//###################################################################

function renderCredit(data){
	gC.attr('style','grid-template-columns: repeat(8, minmax(0, 1fr)) 170px 170px; grid-template-rows: 3fr 1fr');
	$('.titleName').css('outline', 'none')


	const infoSidebar = $('<div>').attr('class', 'infoSidebar').appendTo(gC);
	const personalInfo = $('<div>').attr('class', 'personalInfo item').appendTo(infoSidebar);
	const touchMe = $('<span>').attr('class','touchMe').text('Click a name!').appendTo(personalInfo);
	const personalImg = $('<div>').attr('class', 'personalImg item').appendTo(infoSidebar);
	const shovel = $('<div>').attr('class','shovel').appendTo(personalImg)
	const diggingman = $('<video>').attr('type','video/mp4').prop({ autoplay: true, muted: true, loop: true,}).appendTo(personalImg)
	
	const infoWrapper = $('<div>').attr('class', 'infoWrapper');
	const whichTeam = $('<div>').attr('class', 'whichTeam').append($('<span>')).append($('<span>')).appendTo(infoWrapper);
	const whichurl = $('<div>').attr('class', 'whichUrl').append($('<a>')).appendTo(infoWrapper);
	const insta = $('<div>').attr('class', 'insta').append($('<span>')).append($('<span>')).appendTo(infoWrapper);
	const contact = $('<div>').attr('class', 'contact').append($('<span>')).append($('<span>')).appendTo(infoWrapper);
//--------------------------------------------------------------------------
//--------------------------------------------------------------------------

	const teamList = $('<div>').attr('class', 'teamList').appendTo(gC);
	//팀별 순회
	for(let i = 0; i<4; i++){
		const team = $('<div>').attr('class', `team team${i+1} item`).appendTo(teamList);
		const teamName = $('<span>').attr('class', 'teamName').text(data[i][currLang].name).appendTo(team);
		//팀 내 역할별 순회
		for(let j in data[i][currLang].roleList){
			let indexJ = Object.keys(data[i][currLang].roleList).indexOf(j);
			const roleDiv = $('<div>').attr('class','roleBlock').appendTo(team);
			const role = $('<span>').attr('class', 'duty').text(Object.keys(data[i][currLang].roleList)[indexJ]).appendTo(roleDiv);
			console.log(data[i][currLang].roleList);
			//역할별 이름 채워넣기
			for(let k in data[i][currLang].roleList[j]){
				const target = data[i][currLang].roleList[j][k];
				const roleName = $('<span>').attr('class', 'inCharge').text(target.name).appendTo(roleDiv);
				if(currLang==='en'){
					roleName.css('flex','1 1 100%');
				}
				roleName.click((e)=>{
					e.stopPropagation();

					if(!roleName.hasClass('highlightOn')){
						roleName.toggleClass('highlightOn');
						//video src 끼워넣기
						shovel.css('display','none');
						//diggingman.css('display', 'block').attr('src', `/video/${target.name}.mp4`)
						diggingman.css('display', 'block').attr('src', `/video/${target.query}_750px.mp4`)//샘플

						//선택자 하이라이트, 인포창 띄우기
						$('.infoWrapper').remove();
						$('span').not(this).removeClass('highlightOn');
						roleName.toggleClass('highlightOn');
						$('.touchMe').css('display', 'none');
						infoWrapper.appendTo(personalInfo)
						$('.whichTeam span:first-child').text(`${target.team} ${target.role}`);
						$('.whichTeam span:last-child').text(target.name);
						$('.whichUrl a').text(target.url).attr({'href': `https://${target.url}`, 'class': 'highlightOn', 'target': 'blank'});
						$('.insta span:first-child').text('instagram');
						$('.insta span:last-child').text(target.personalUrl);
						$('.contact span:first-child').text('e-mail');
						$('.contact span:last-child').text(target.email);
						(()=>{
							$(".infoWrapper").multilingual([
								'en', 'num'
							]);
						})()
					}
				})
			}
			//add name click eventlistener
			$('.teamList').not('span.inCharge.highlightOn').click(()=>{
				$('.touchMe ~ div').remove();
				$('.inCharge').removeClass('highlightOn');
				$('.touchMe').css('display', 'block');
				shovel.css('display','block');
				diggingman.css('display','none');
			});
		}

	}
//--------------------------------------------------------------------------
//--------------------------------------------------------------------------

const creditAbout = $('<div>').attr('class', 'creditAbout item').appendTo(gC);
	const div1 = $('<div>').attr('class','div1').appendTo(creditAbout);
	const div2 = $('<div>').attr('class','div2').appendTo(creditAbout);
	
	const advisorDiv = $('<div>');
	const advisor = $('<span>').attr('class','duty').appendTo(advisorDiv);
	const seok = $('<span>').attr('class','inCharge').appendTo(advisorDiv);	

	const sponsorDiv = $('<div>').append('<span>').append('<span>');
	const sponsor = $('<span>').attr('class','duty').appendTo(sponsorDiv);
	const hivcd = $('<span>').attr('class','inCharge').appendTo(sponsorDiv);	
	div1.append(advisorDiv, sponsorDiv)

	const title = $('<p>').attr('class','title').text('Dig deep');
	const keynote = $('<p>');
	div2.append(title,keynote);
	
	if (currLang==='ko'){
		advisor.text('지도 교수');
		seok.text('석재원');
		sponsor.text('주최');
		hivcd.text('홍익대학교 시각디자인과')
		keynote.text('2020년, 준비를 마친 인부들이 이동을 시작했다. 오프라인에서 온라인으로, 전신의 움직임에서 손가락의 작은 움직임으로, 땅 위에서 픽셀 위로…. 수많은 변화 속에서 그들은 존재를 지속할 수 있는 무언가를 찾아 나섰다. 각자가 속한 그리드와 픽셀 위에서, 28명의 인부들은 삽을 들고 더 깊은 아래를 향해 웹 속을 파고든다. 그 끝에 발굴해낸 새로운 가능성과 존재의 조각이 궁금하다면, dig deep.')
	}else{	
		advisor.text('Professor');
		seok.text('Jaewon Seok');
		sponsor.text('Auspice');
		hivcd.text('HIVCD')
		keynote.text('In 2020, after extensive preparation, workers began to move. From offline to online, from full-body movement to small finger movements, from the ground to pixels above... Amidst a multitude of changes, they longed to find that “something” (or quality) that will rest immortally. On top of the grid and pixels to which they correspond, twenty-eight members hold a shovel to dig deeper into the web. If you are curious about the new possibilities and pieces unearthed, dig deep.');
	}

};

//###################################################################
//###################################################################
//###################################################################

function getData(url){
	return new Promise((res, rej)=>{
		const data = $.get(url, (d)=>{console.log(d)});
		res(data);
	})
};

const route = {
	'1': async () => {
		await getData('https://minw0525.github.io/digdeep_final/data/json1_main.json')
			.then(res => renderMain(res))
		makeMultilingual()
	},
	'2': async () => {
		await getData('https://minw0525.github.io/digdeep_final/data/json2_project.json')
			 .then(res => renderProject(res));
			makeMultilingual()
	},
	'3': async () => {
		await getData('https://minw0525.github.io/digdeep_final/data/json3_credit.json')
			.then(res => renderCredit(res));
		makeMultilingual()
	},
	otherwise(path){
		$('body').innerHTML = `${path} Not Found`;
	}
};

function router(path) {
	(route[path] || route.otherwise)(path);
}

function makeMultilingual(){
	$("body").multilingual([
		'en', 'num'
	]);
}

function load(url){
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
