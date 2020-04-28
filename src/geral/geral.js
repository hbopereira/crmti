export function formatDate(date) {
   var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + (d.getDate() + 1),
      year = d.getFullYear();

   if (month.length < 2)
      month = '0' + month;
   if (day.length < 2)
      day = '0' + day;

   return [year, month, day].join('-');
}

export function formatDate2(date) {
   var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + (d.getDate() + 1),
      year = d.getFullYear();

   if (month.length < 2)
      month = '0' + month;
   if (day.length < 2)
      day = '0' + day;

   return [day, month, year].join('/');
}

export function tratarDatasParaEditar(evento) {
   const dat = new Date(evento.dat);
   const datage = new Date(evento.datage);

   dat.setDate(dat.getDate() + 1);
   datage.setDate(datage.getDate() + 1);

   evento.dat = formatDate(dat);
   evento.datage = formatDate(datage);
}


export function tratarDatasParaEditar2(evento) {
   const dat = new Date(evento.dat);
   const datage = new Date(evento.datage);

   dat.setDate(dat.getDate());
   datage.setDate(datage.getDate());

   evento.dat = formatDate(dat);
   evento.datage = formatDate(datage);
}

export default { formatDate, formatDate2, tratarDatasParaEditar, tratarDatasParaEditar2 }
