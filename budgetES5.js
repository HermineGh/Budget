var nodesForEach = function(nodeList, callback) {
		for(var i = 0; i < nodeList.length; i++){
			callback(nodeList[i], i)	
		}
	};
var budgetFns =( function() {
	var Income = function( Id, txt, val) {
		this.Id = Id;
		this.txt = txt;
		this.val = val
		
	};
	var Expense = function( Id, txt, val) {
		this.Id = Id;
		this.txt = txt;
		this.val = val,
		this. expPercentage = -1
	};
	Expense.prototype.expItemPercentage = function(totalInc) {
		if(totalInc > 0){
			this. expPercentage = Math.round((this.val/ totalInc) * 100);
		}else { this.expPercentage = -1}
			
		};

	var data = {
		allItems:{
			inc:[],
			exp:[]
		},
		total:{
			inc:0,
			exp:0
		},
		budget:0,
		percentage:-1
	};

	var  calcBudget = function(type) {
			var sum = 0;

			data.allItems[type].forEach(function(curr){
				sum += parseFloat(curr.val);
			});			
			data.total[type] = sum;
			return sum
			}
			
	return {
		createItem: function(type, txt, val) {
			var IdVal, Id, Item, itemPerc;
			if(data.allItems[type].length > 0){
				Id = data.allItems[type][data.allItems[type].length-1].Id + 1;
			}else {Id = 0}
			if(type === 'inc'){
				 Item = new Income(Id, txt, val);
			}else if(type === 'exp'){
				Item = new Expense(Id, txt, val);
			}
			data.allItems[type].push(Item);
			return Item
		},
		removeItem: function(itemForDelete) {
			var IDVal,Id, type, index;
			IDVal = itemForDelete.id;
			type = IDVal.split('-')[0];
			Id = parseInt(IDVal.split('-')[1]);
			data.allItems[type].forEach(function(curr, i) {
				if(curr === Id){index = i }
			})
			data.allItems[type].splice(index, 1)
		},
		calculateTotal: function() {
			var percentage, totalInc, totalExp, budget;
			totalInc = calcBudget('inc');
			totalExp = calcBudget('exp');
			budget = totalInc - totalExp;
			if(totalInc > 0){
				percentage = Math.round((totalExp / totalInc) * 100);
			}else{ percentage = -1}
			return{
				totalInc: totalInc,
				totalExp: totalExp,
				budget: budget,
				percentage: percentage
			}
		},
		expItemPercColc: function() {
			if(data.allItems['exp'].length > 0){
				data.allItems['exp'].forEach(function(curr) {
					curr.expItemPercentage(data.total.inc);
				}) 
				return data.allItems['exp'];
			}
		},
		thisMonth: function() {
			var today = new Date();
			var months = ['Հունվար', 'Փետրվար', 'Մարտ', 'Ապրիլ', 'Մայիս', 'Հունիս', 'Հուլիս', 'Օգոստոս', 'Սեպտեմբեր', 'Հոկտեմբեր', 'Նոյեմբեր', 'Դեկտեմբեր'];
			return  months[today.getMonth()];
		}
	}
})();

var UIitems = (function() {
	var DomItems = {
		selectType: '.add__type',
		addDescription: '.add__description',
		addValue: '.add__value',
		addBtn: '.add__btn',
		inc: '.income__list',
		exp: '.expenses__list',
		budget: '.budget__value',
		income: '.budget__income--value',
		expenses: '.budget__expenses--value',
		percentage: '.budget__expenses--percentage',
		container:'.container',
		expPerc: '.item__percentage',
		monthLabel: '.budget__title--month'
	}
	var formatNumber = function (numb, type) {
		var numbArr, persition, firstItemNumb, str="";
		numb = numb.toFixed(2);
		numbArr = numb.split('.');
		numb = numbArr[0];
		persition = numbArr[1];
        firstItemNumb = ((numb.length)%3);
        str = numb.substring(0, firstItemNumb);
        
		for(var i = firstItemNumb; i < numb.length; i+=3 ){
			if(str){str += ',' + numb.substring(i, i+3);
				}else {str += numb.substring(i, i+3)};
		};

		numb = str + '.' + persition;

		if(type === 'inc'){ numb = '+ ' + numb;
			}else if(type === 'exp'){numb = '- ' + numb;}

		return numb;	    
}
	return {
		DOMtags: function() {return DomItems},

		takeValues: function() {
			return{
				type: document.querySelector(DomItems.selectType).value,
				txt: document.querySelector(DomItems.addDescription).value,
				val: document.querySelector(DomItems.addValue).value
			}
		},
		newDOMitem: function(newObj, type) {
			var elHtml, newEl;
			if(type === 'inc'){
				elHtml = '<div class="item clearfix" id="inc-%Id"><div class="item__description">%txt</div><div class="right clearfix"><div class="item__value">%val</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			}else if(type === 'exp'){
				elHtml = '<div class="item clearfix" id="exp-%Id"><div class="item__description">%txt</div><div class="right clearfix"><div class="item__value">%val</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			}
			//console.log(formatNumber(Number(newObj.val)));
			newEl = elHtml.replace('%Id', newObj.Id);
			newEl = newEl.replace('%txt', newObj.txt);
			newEl = newEl.replace('%val', formatNumber(Number(newObj.val), type));
			document.querySelector(DomItems[type]).insertAdjacentHTML('beforeend', newEl)
			return newEl
		},
		updateBudget: function(budgetObj) {
			var budgetType;
			budgetObj.budget >= 0 ? budgetType = "inc": type = '';
			document.querySelector(DomItems.budget).textContent = formatNumber(budgetObj.budget, budgetType);
			document.querySelector(DomItems.income).textContent = formatNumber(budgetObj.totalInc, 'inc');
			document.querySelector(DomItems.expenses).textContent = formatNumber(budgetObj.totalExp, 'exp');
			if(budgetObj.percentage > 0){
				document.querySelector(DomItems.percentage).textContent = budgetObj.percentage + "%";
			}else{
				document.querySelector(DomItems.percentage).textContent = '---';
			};
			
		},
		resetField: function(){
			document.querySelector(DomItems.addDescription).value = '';
			document.querySelector(DomItems.addValue).value = ''
		}, 
		removeDomItem: function(itemForDelete) {
			itemForDelete.parentNode.removeChild(itemForDelete);
		},
		updateExppensesPerc: function(allExpItems) {
			var expItems, i;
			expItems = document.querySelectorAll(DomItems.expPerc);
			for(var i = 0; i < expItems.length; i++){
				if(allExpItems[i].expPercentage > 0){
					expItems[i].textContent = allExpItems[i].expPercentage + '%';
				}else { expItems[i].textContent = '--'}
				
			}
		},
		putMonth: function(month) {
			document.querySelector(DomItems.monthLabel).textContent = month;
		},
		changeFieldsColor: function() {
			var fields;
			fields = document.querySelectorAll(
				DomItems.selectType + ', ' +
				DomItems.addDescription + ', ' +
				DomItems.addValue
			);
			nodesForEach(fields, function(curr) {
				curr.classList.toggle('red-focus');
			});
			document.querySelector(DomItems.addBtn).classList.toggle('red');
		}
	}
})();

var controllers = (function(budgetFn , UIControlls) {
		var items, budgetVals, expItemsPerc;
		//catch UI Elements
		tags = UIControlls.DOMtags();

		var addFielditems = function() {
			var allValues, newItem, newItemVals;
			allValues = UIControlls.takeValues();
			if(allValues.txt !=='' && allValues.val !== '' && !isNaN(allValues.val)){
				newItemVals = budgetFn.createItem(allValues.type, allValues.txt, allValues.val);
				newItem = UIControlls.newDOMitem(newItemVals, allValues.type);
				budgetVals = budgetFn.calculateTotal();
				UIControlls.updateBudget(budgetVals);
				UIControlls.resetField();
				expItemsPerc = budgetFn.expItemPercColc();
				UIControlls.updateExppensesPerc(expItemsPerc);
			}

		};

		var deleteItem = function(e) {
			itemForDelete = e.target.parentNode.parentNode.parentNode.parentNode;
			if(itemForDelete.id){
				budgetFn.removeItem(itemForDelete);
				UIControlls.removeDomItem(itemForDelete);
				budgetVals = budgetFn.calculateTotal();
				UIControlls.updateBudget(budgetVals);
				expItemsPerc = budgetFn.expItemPercColc();
				UIControlls.updateExppensesPerc(expItemsPerc)

			}
			
		};

		//Event Listeners
		function eventListeners() {
			document.querySelector(tags.addBtn).addEventListener('click',addFielditems);
			document.addEventListener('keypress', function(e) {if(e.keyCode === 13){addFielditems()}
			});
			document.querySelector(tags.container).addEventListener('click', deleteItem);
			document.querySelector(tags.selectType).addEventListener('change', UIControlls.changeFieldsColor);
		};

	//Starting fn	
	return {
		init:function() {
			var month;
				month = budgetFn.thisMonth();
				UIControlls.putMonth(month);
				UIControlls.updateBudget({
					totalInc: 0,
					totalExp: 0,
					budget: 0,
					percentage: -1,
				}),
				eventListeners()		 	
	 	}	
	 }
})(budgetFns, UIitems);

controllers.init();