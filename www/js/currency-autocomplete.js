$(function(){
  var currencies = [
    { value: 'Ngân hàng Ngoại Thương Việt Nam - Vietcombank', data: '970436' },
    { value: 'Ngân hàng Kỹ thương Việt Nam - Techcombank', data: '970407' },
    { value: 'Ngân hàng Quân đội - MBBank', data: '970422' },
    { value: 'Ngân hàng Quốc tế - VIB', data: '970441' },
    { value: 'Ngân hàng Công thương - ViettinBank', data: '970489' },
    { value: 'Ngân hàng Hàng hải - Maritimebank', data: '970441' },
    { value: 'Ngân hàng Việt Nam Thịnh vượng - VPBank', data: '970432' },
    { value: 'Ngân hàng Nam Á - NamAbank', data: '970428' },
    { value: 'Ngân hàng Sài Gon - Saigonbank', data: '161087' },
    { value: 'Ngân hàng Xăng dầu Petrolimex - PGBank', data: '970430' },
    { value: 'Ngân hàng Phát triển Nông thôn - Agribank', data: '970499' },
    { value: 'Ngân hàng Việt Á - VietAbank', data: '970427' },
    { value: 'Ngân hàng Đại dương - Oceanbank', data: '970414' },
    { value: 'Ngân hàng An Bình - ABBank', data: '970459' },
    { value: 'Ngân hàng Tiền Phong - TPBank', data: '970423' },
    { value: 'Ngân hàng Đầu tư và phát triển Việt Nam - BIDV', data: '970488' },
    { value: 'Ngân hàng SHB - SHBank', data: '970443' },
    { value: 'Ngân hàng Đông Nam Á - Seabank', data: '970468' },
    { value: 'Ngân hàng Bắc Á - BACA', data: '970409' },
  ];
  
  // setup autocomplete function pulling from currencies[] array
  $('#autocomplete').autocomplete({
    lookup: currencies,
    onSelect: function (suggestion) {
    //   var thehtml = '<strong>Currency Name:</strong> ' + suggestion.value + ' <br> <strong>Symbol:</strong> ' + suggestion.data;
    var thehtml = suggestion.value;
      $('#outputcontent').html(thehtml);
    }
  });
  

});