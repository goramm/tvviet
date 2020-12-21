$(function() {
	
	class Category {
		static all = 'Svi';
		
		constructor(name, patterns) {
			this.name = name;
			this.patterns = patterns;
		}
	}
	
	const categories = [
		new Category("Sport", ["sk", "sport", "hntv", "fight", "nba"]),
        new Category("Film", ["amc", "axn", "hbo", "cine", "diva", "epic", "fox", "tv1000", "action", "emotion", "kino", "klasik", "movie", "viet", "superstar", "scifi", "rtl-crime"]),
        new Category("Hrvatska", ["hrt", "nova tv", "n1-hr", "rtl", "doma"]),
        new Category("BiH", ["bh", "ftv", "rtrs", "obn", "hayat"]),
        new Category("Srbija", ["rts", "nova-s", "prva", "n1-srb"]),
        new Category("Dokumentarac", ["animal", "bbc", "brainz", "doku", "docu", "discovery", "dtx", "national", "natgeo", "history", "tlc", "travel", "viasat", "investigation", "lov", "pedia", "wild"]),
        new Category("Muzika", ["mtv", "vh", "jugoton", "cmc"]),
    ];
            
	const params = new URLSearchParams(window.location.search);
	const searchParam = params.get('q') ? params.get('q') : '';
	const categoryParam = params.get('c') ? params.get('c') : '';
	const html = '<div class="search-group"><input class="form-control" placeholder="Pretraga" name="search" id="search" type="text" autocomplete="off" value="'+ searchParam +'" autofocus>'+ createCategorySelect() +'<\div>';
	$('.more-channel-box').prepend(html);
	
	$(document.body).on('keyup', '#search', function(e) {
		if (e.key === 'Escape') {
			$('.more-channel-btn i').click();
			return;
		}
		if ($(this).val()) {
			searchChannels();
			if (e.key === 'Enter') {
				navigateToFirstVisibleChannel();
			}
		} else {
			searchChannels();
			animateToCurrentChannel();
		}
	});
	
	let fullScreen = false;
	$(document).on('keyup', function(e) {
		if (e.key === 'Alt' || e.key === 'AltGraph') {
			e.preventDefault();
			$('.more-channel-btn i').click();
		} else if (e.target.id === 'search') { 
			return; 
		}
		navigateChannelsByArrow(e);
		if (e.key === '/' || e.key === '-') {
			if (!fullScreen) {
				$(this).focus();
				$('#html5-player')[0].requestFullscreen();
				fullScreen = true;
			} else {
				document.exitFullscreen();
				fullScreen = false;
			}
			
		}
	});
	
	$('.more-channel-btn').on('click', function() {
		setTimeout(function() {
			animateToCurrentChannel();
			$('#search').focus();
			$('#search')[0].setSelectionRange(0, -1);
		}, 500);
	});
	
	$('.channel-box a').on('click', function(e) {
		e.preventDefault();
		redirectTo(this.href);
	});
	
	$(document.body).on('change', '.form-select-channels', function() {
		const $channel = $('a[href="'+ this.value +'"]');
		if ($channel.length) {
			redirectTo(this.value)
		}
	});
	
	$(document.body).on('change', '.form-select-categories', function() {
		searchChannels();
	});
	
	$(document.body).on('click', '.prev-channel', function() {
		prevChannel();
	});
	
	$(document.body).on('click', '.next-channel', function() {
		nextChannel();
	});
	
	function createCategorySelect() {
		let html = '<select id="category" class="form-control form-select-categories"><option value="'+ Category.all +'" selected>Svi kanali</option>';
		for(let category in categories) {
			let name = categories[category].name;
			html += '<option value="'+ name +'"'+ (categoryParam === name ? ' selected' : '') +'>'+ name +'</option>';
		}
		html += '</select>';
		return html;
	}
	
	function searchChannels() {
		const text = $('#search').val() ? $('#search').val() : '';
		const category = $('#category').val() ? $('#category').val() : (params.get('c') ? params.get('c') : Category.all);
		$('.col-channel').hide();
		let $channels = $('.col-channel');
		if (category === Category.all) {
			$channels.show();
		} else {
			$channels.hide();
			$channels = $channels.filter(function() {
				return $(this).data('category') === category;	
			});
			$channels.show();
		}
		
		
		if (text) {
			$channels.hide();
			$channels = $channels.filter(function() {
				return $(this).data('channel').toLowerCase().includes(text.toLowerCase());
			});
			$channels.show();
		}

	}
	
	function animateToCurrentChannel() {
		$('.more-channel-box').animate({ scrollTop: $('.current-channel').position().top }, 500);
	}
	
	function navigateChannelsByArrow(e) {
		if (e.key === 'ArrowLeft') {
			prevChannel();
		} else if (e.key === 'ArrowRight') {
			nextChannel();
		}
	}
	
	function nextChannel() {
		const pathname = window.location.pathname;
		const $channelLink = $('a[href="'+ pathname +'"]');
		
		const $next = $channelLink.closest('.col-channel')
			.nextAll('.col-channel')
			.filter(function() {
				return $(this).css('display') !== 'none'
			});
		if ($next.length) {
			redirectTo($next.first().find('a').attr('href'));
		}
	}
	
	function prevChannel() {
		const pathname = window.location.pathname;
		const $channelLink = $('a[href="'+ pathname +'"]');
		
		const $prev = $channelLink.closest('.col-channel')
			.prevAll('.col-channel')
			.filter(function() {
				return $(this).css('display') !== 'none'
			});
		if ($prev.length) {
			redirectTo($prev.first().find('a').attr('href'));
		}
	}
	
	function navigateToFirstVisibleChannel() {
		const $channel = $('.col-channel:visible:first');
		if ($channel.length) {
			const href = $channel.find('a').attr('href');
			redirectTo(href);
		}
	}
	
	function redirectTo(href) {
		const q = $('#search').val();
		const c = $('#category').val();
		href += q ? '?q=' + q : '';
		href += c ? (q ? '&' : '?')+ 'c=' + c : '';
		window.location.href = href;
	}
	
	function selectCurrentChannel() {
		const channel = window.location.pathname;
		const $channel = $('a[href="'+ channel +'"]');
		if ($channel.length) {
			$channel.closest('.channel-box').addClass('current-channel');
		}
	}
	
	function createSelectChannels() {
		let html = '<div class="select-channels"><button class="prev-channel">&#8249;</button>';
		html += '<select class="form-control form-select-channels">';
		const $cols = $('.col-channel').filter(function() {
			return $(this).css('display') !== 'none'
		});
		$cols.each(function() {
			const $this = $(this);
			const pathname = window.location.pathname;
			const value = $this.find('a').attr('href');
			let text = $this.data('channel');
			html += '<option value="'+ value +'"'+ (pathname === value ? ' selected' :  '') +'>'+ text +'</value>'
		});
		
		html += '</select>';
		html += '<button class="next-channel">&#8250;</button></div>';
		$('#epg').prepend(html);
	}
	
	function addCategoryAndNameToChannels() {
		const $channels = $('.col-channel a');
		$channels.each(function() {
			const $channel = $(this);
			const $parent = $channel.closest('.col-channel');
			const href = $channel.attr('href');
			let channelName = href.substring(href.lastIndexOf('/') + 1);
			channelName = channelName.replace(/-/g, ' ');
			$parent.attr('data-channel', channelName);
            for(let cat in categories) {
            	let category = categories[cat];
                for(let pattern in category.patterns) {
                    if (channelName.toLowerCase().includes(category.patterns[pattern].toLowerCase())) {
                        $parent.attr('data-category', category.name);
                    }
                }
            }
		});
	}
	
	addCategoryAndNameToChannels();
	selectCurrentChannel();
	if (searchParam || categoryParam) {
		searchChannels();
	}
	createSelectChannels();
});

// Reminder
$(function() {
	String.prototype.capitalize = function() {
	  return this.charAt(0).toUpperCase() + this.slice(1)
	}
	
	class Reminder {
		constructor({ id, channel, title, date }) {
			this.id = id;
			this.title = title;
			this.channel = channel;
			this.date = date;
		}
		getDate(){
			return new Date(this.date);
		}
		getChannelName() {
			let channelName = this.channel.substring(this.channel.lastIndexOf('/') + 1);
			return channelName.replace(/-/g, ' ');
		}
		isTime() {
			const now = new Date();
			const date = this.getDate();
			return now.getFullYear() == date.getFullYear() && now.getMonth() == date.getMonth() && now.getDate() == date.getDate() && now.getHours() == date.getHours() && now.getMinutes() == date.getMinutes()
		}
	}
	
	class ReminderStorage {
		static getItems() {
			const items = JSON.parse(localStorage.getItem('reminders')) || [];
			return items.map((item) => new Reminder(item));
		}
		static setItem(reminder) {
			const items = ReminderStorage.getItems();
			items.push(reminder);
			localStorage.setItem('reminders', JSON.stringify(items));
		}
		static removeItem(reminder) {
			let items = ReminderStorage.getItems();
			items = items.filter((item) => reminder.id != item.id);
			localStorage.setItem('reminders', JSON.stringify(items));
		}
	}
	
	if (ReminderStorage.getItems().length) {
		setInterval(function() {
			const items = ReminderStorage.getItems();
			for (var item in items) {
				const reminder = items[item];
				if (reminder.isTime()) {
					const message = `PODSJETNIK\r\nKanal: ${reminder.getChannelName()}\r\nNaziv: ${reminder.title}\r\nŽelite gledati?`;
					const response = confirm(message);
					if (response) {
						ReminderStorage.removeItem(reminder);
						window.location.href = reminder.channel;
					} else {
						ReminderStorage.removeItem(reminder);
					}
				}
				
			}
		}, 5000);
	}
	
	$('#epg tr > td:first-child').attr('title', 'Dodaj podsjetnik');
	$(document.body).on('click', '#epg tr > td:first-child', function() {
		const channel = window.location.pathname;
		const now = new Date();
		
		const title = $(this).next().text().capitalize();
		const dateStr = `${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()} ${$(this).text()}`;
	
		const reminder = new Reminder({ id: Date.now(), channel, title });
		const response = prompt(`PODSJETNIK\r\nKanal: ${reminder.getChannelName()}\r\nNaziv: ${title}\r\nUnesite datum i vrijeme za podsjetnik:`, dateStr);
		if (response) {
			reminder.date = response;
			ReminderStorage.setItem(reminder);
		}
		
	});
});
