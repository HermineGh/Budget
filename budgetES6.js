const budgetFns =(() => {
	class Income {
			constructor(Id, txt, val){
				Object.assign(this, {Id, txt, val})
		}
	};
	class Expense {
			constructor(Id, txt, val){
				Object.assign(this, {Id, txt, val});
				this. expPercentage = -1	
			}
			expItemPercentage(totalInc){
				totalInc > 0 ? this. expPercentage = Math.round((this.val / totalInc) * 100) : this.expPercentage = -1;
			}
	};
	const data = {
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
	calcBudget = type => {
		let sum = 0;
		data.allItems[type].forEach(curr => sum += parseFloat(curr.val));
		data.total[type] = sum;
	return sum
	}
	return {
		createItem: function(type, txt, val){
			let IdVal, Id, Item, itemPerc;
			data.allItems[type].length > 0 ? Id = data.allItems[type][data.allItems[type].length-1].Id + 1 : Id = 0;
			if(type === 'inc'){
				 Item = new Income(Id, txt, val);
			}else if(type === 'exp'){
				Item = new Expense(Id, txt, val);
			}
			data.allItems[type].push(Item);
		return Item
		},
		removeItem: itemForDelete => {
			let IDVal,Id, type, index;
			IDVal = itemForDelete.id;
			type = IDVal.split('-')[0];
			Id = parseInt(IDVal.split('-')[1]);
			data.allItems[type].forEach((curr, i)=> {if(curr === Id){index = i }})
			data.allItems[type].splice(index, 1)
		},
		calculateTotal: () => {
			let percentage, totalInc, totalExp, budget;
			totalInc = calcBudget('inc');
			totalExp = calcBudget('exp');
			budget = totalInc - totalExp;
			totalInc > 0 ? percentage = Math.round((totalExp / totalInc) * 100) : percentage = -1;
		return{
				totalInc: totalInc,
				totalExp: totalExp,
				budget: budget,
				percentage: percentage
			}
		},
		expItemPercColc: () => {
			if(data.allItems['exp'].length > 0){
				data.allItems['exp'].forEach(curr => curr.expItemPercentage(data.total.inc)) 
				return data.allItems['exp'];
			}
		},
		thisMonth: () => {
			const today = new Date();
			const months = ['Հունվար', 'Փետրվար', 'Մարտ', 'Ապրիլ', 'Մայիս', 'Հունիս', 'Հուլիս', 'Օգոստոս', 'Սեպտեմբեր', 'Հոկտեմբեր', 'Նոյեմբեր', 'Դեկտեմբեր'];
			return  months[today.getMonth()];
		}
	}
})();

const UIitems = (() => {
	const DomItems = {
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
	const {selectType, addDescription, addValue, addBtn, inc, exp, budget, income, expenses, percentage, container, expPerc, monthLabel} = DomItems;

	const formatNumber =  function(numb, type){
			let numbArr, persition, firstItemNumb, str="";
			numb = numb.toFixed(2);
			numbArr = numb.split('.');
			numb = numbArr[0];
			persition = numbArr[1];
	        firstItemNumb = ((numb.length)%3);
	        str = numb.substring(0, firstItemNumb);
	        
			for(let i = firstItemNumb; i < numb.length; i+=3 ){
				str ? str += ',' + numb.substring(i, i+3) : str += numb.substring(i, i+3);
			};
			numb = `${str}.${persition}`;
			if(type === 'inc'){ numb = `+ ${numb}`;
				}else if(type === 'exp'){numb = `- ${numb}`}
		return numb;	    
}
	return {
		DOMtags: () => DomItems,
		takeValues: () => {
				type = document.querySelector(selectType).value;
				txt = document.querySelector(addDescription).value;
				val = document.querySelector(addValue).value;
			return [type, txt, val]
		},
		newDOMitem: (newObj, type) => {
			let elHtml, newEl;
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
		updateBudget: budgetObj => {
			let budgetType;
			budgetObj.budget >= 0 ? budgetType = "inc": type = '';
			document.querySelector(budget).textContent = formatNumber(budgetObj.budget, budgetType);
			document.querySelector(income).textContent = formatNumber(budgetObj.totalInc, 'inc');
			document.querySelector(expenses).textContent = formatNumber(budgetObj.totalExp, 'exp');
			if(budgetObj.percentage > 0){
				document.querySelector(percentage).textContent = budgetObj.percentage + "%";
			}else{
				document.querySelector(percentage).textContent = '---';
			};
			
		},
		resetField: () => {
			document.querySelector(addDescription).value = '';
			document.querySelector(addValue).value = ''
		}, 
		removeDomItem: itemForDelete => itemForDelete.parentNode.removeChild(itemForDelete),
		updateExppensesPerc: allExpItems => {
			let expItems, i;
			expItems = document.querySelectorAll(expPerc);
			for(let i = 0; i < expItems.length; i++){
				(allExpItems[i].expPercentage > 0) ? expItems[i].textContent = allExpItems[i].expPercentage + '%': expItems[i].textContent = '--'
			}
		},
		putMonth: month => document.querySelector(monthLabel).textContent = month,
		changeFieldsColor: () => {
			let fields;
			fields = document.querySelectorAll(`${selectType}, ${addDescription}, ${addValue}`);
			Array.from(fields).forEach(curr => curr.classList.toggle('red-focus'));
			document.querySelector(addBtn).classList.toggle('red');
		}
	}
})();

const controllers = ((budgetFn, UIControlls) => {
		let items, budgetVals, expItemsPerc;
		//catch UI Elements
		const tags = UIControlls.DOMtags();

		const addFielditems = () => {
			let newItem, newItemVals;
			let [type, txt, val] = UIControlls.takeValues();
			if(txt !=='' && val !== '' && !isNaN(val)){
				newItemVals = budgetFn.createItem(type, txt, val);
				newItem = UIControlls.newDOMitem(newItemVals, type);
				budgetVals = budgetFn.calculateTotal();
				UIControlls.updateBudget(budgetVals);
				UIControlls.resetField();
				expItemsPerc = budgetFn.expItemPercColc();
				UIControlls.updateExppensesPerc(expItemsPerc);
			}
		};
		const deleteItem = e => {
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
			document.addEventListener('keypress', e => {if(e.keyCode === 13)addFielditems()});
			document.querySelector(tags.container).addEventListener('click', deleteItem);
			document.querySelector(tags.selectType).addEventListener('change', UIControlls.changeFieldsColor);
		};
	//Starting fn	
	return {
		init:() => {
			let month;
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