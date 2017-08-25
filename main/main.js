const  loadAllItems = require('../main/datbase.js');
const loadPromotions = require('../main/database1.js');
module.exports = function printInventory(inputs) {
    var allItems = loadAllItems();
var loadPromotion = loadPromotions();
var result = AllItemInfo(inputs);
var promotion = Promotion(result);
var sum = summary(result);
var save = summary(promotion);
var str = '***<没钱赚商店>购物清单***\n';
result.forEach(item => {
	str += '名称：'+item.name+'，数量：'+item.count+item.unit+'，单价：'+item.price.toFixed(2)+'(元)，小计：'+item.subtotal.toFixed(2)+'(元)\n'
});
str += '----------------------\n挥泪赠送商品：\n';
promotion.forEach(item => {
	str += '名称：'+item.name+'，数量：1'+item.unit+'\n'
});
str += '----------------------\n总计：'+sum.toFixed(2)+'(元)\n节省：'+save.toFixed(2)+'(元)\n**********************'
console.log(str);

function AllItemInfo(inputs){
	var result = [];
	inputs.forEach(item=>{
		if (item.includes("-")) {
			var barcode = item.split("-")[0];
			var num = parseInt(item.split("-")[1]);
			result = Calculate(result,barcode,num);
		} else {
			result = Calculate(result,item,1);
		}
	});
	return result;
}
function Calculate(result,barcode,count){
	if (result.some(ele => ele.barcode === barcode)) {
		var id = result.findIndex(ele => ele.barcode === barcode);
		result[id].count += count;
		result[id].subtotal += count*result[id].price;
	} else {
		result.push(push(barcode,count));
	}
	return result;
}

function push(barcode,count){
	var result = {};
	var index = allItems.findIndex(ele => ele.barcode === barcode);
	result = {
		barcode: barcode,
		name: allItems[index].name,
		unit: allItems[index].unit,
		price: allItems[index].price,
		count: count,
		subtotal : allItems[index].price * count
	}
	return result;
}
function Promotion(arr){
	var promotionItem = [];
	arr.forEach(item => {
		if(loadPromotion[0].barcodes.includes(item.barcode)){
			promotionItem.push({name:item.name,unit:item.unit,subtotal:item.price});
			item.count;
			item.subtotal -= item.price;
		}
	});
	return promotionItem;
}
function summary(arr){
	var sum = 0;
	arr.forEach(item => {
		sum += item.subtotal;
	});
	return sum;
}

};