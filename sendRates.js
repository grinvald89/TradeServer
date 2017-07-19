var xhr = new XMLHttpRequest(),
	pair, percent, rate, request, msgBox;

setInterval(() => {
	msgBox = document.querySelectorAll('div.msg-box').length;

	if (!msgBox) {
		pair = document.querySelector('#platform .platform-block .tab-pairs ul.tabs li.-selected span.title').innerHTML,
		percent = document.querySelector('#platform .platform-block .tab-pairs ul.tabs li.-selected span.percent').innerHTML,
		rate = document.querySelector('#platform .platform-block .tableWrapper svg.svgTemplate g.cutoffG text.pin_text').innerHTML;

		startIndex = percent.search(/-->\d+<!--/);
		endIndex = percent.indexOf('<!--', startIndex + 3) - startIndex;
		percent = +percent.substr(startIndex + 3, endIndex - 3);

		request = {
			pair: pair.replace(/&nbsp;/g, ' '),
			rate: rate,
			percent: percent
		}

		xhr.open("POST", "http://127.0.0.1:1337/");

		xhr.send(JSON.stringify(request));

		console.log(request);
	}
	else
		console.log({
			status: 'Pair is inactive.',
			date: new Date()
		});
}, 1000);