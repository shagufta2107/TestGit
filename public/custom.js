
$(document).ready(function(){
    $('#ajax-loader').hide();
    $.ajax({
                type: "GET",
                url:"http://localhost:5000/products",
                beforeSend: function(){
                        $('#ajax-loader').show();
                },
                complete: function(){
                    $('#ajax-loader').hide();
                },

                success: function(data){ 
                    if(data){
                        var len = data.length;
                        var txt = "";
                        if(len > 0)
                        {
                            for(var i=0;i<len;i++){
                            if(data[i]._id && data[i].Category && data[i].MainCategory && data[i].Price){
                                txt += "<tr><td class='prodId'><input type='text'  data-default="+data[i]._id+" value="+data[i]._id+" disabled=true>  </input></td><td class='category' ><input  type='text' data-default="+data[i].Category+" value="+data[i].Category+" disabled=true>  </input></td><td class='mainCategory' ><input  type='text'  data-default="+data[i].MainCategory+" value="+data[i].MainCategory+" disabled=true>  </input></td><td class='price'><input   type='number' data-default="+data[i].Price+" value="+data[i].Price+" disabled=true>  </input></td><td ><span class='updtbtn'><i class='w3-xlarge fa fa-edit'></i></span><span class='saveBtn' style='display:none'><i class='w3-xlarge fa fa-save' ></i></span><span class='cancelBtn' style='display:none'><i class='w3-xlarge fa fa-close cancel'></i></span></td><td><span class='delBtn' ><i class='w3-xlarge fa fa-trash' ></span></td><td><input type=button value='Update' class='simpleupdate'</td></tr>";
                                }
                            }
                            if(txt != ""){
                                $("#table").append(txt);
                            }	
                        }
                    }
                },
                error: function() {
                    alert('Not OKay');
                }
            });
});


$(document).on('click', '.simpleupdate', function(e) { 
    try{
            var prodId="";
            $(this).parent().prevAll('.prodId').each(function() {
                $(this).find('input').each(function () {
                    prodId=this.value;	
                
                })
            });
            window.location='\\update?'+prodId;
        }
        catch(err){
            alert(err);
        }
});


$(document).on('click', '.updtbtn', function(e) { 
try{

    /*$(this).prevAll().each (function() {
        this.setAttribute("contenteditable", true);
        });*/
        
/*	$(this).parent().prevAll().each (function() {
        this.setAttribute("contenteditable", true);
        });*/
        
        
    $(this).parent().prevAll().each (function() {
        field=this.className;
        $(this).find('input').each(function () {
        if (field !='prodId')
         {
            this.disabled=false;
            }
            })
        });
          
    $(this).hide();
    $(this).siblings('.saveBtn').show();
    $(this).siblings('.cancelBtn').show();
    
    
    
}
catch(err){alert(err);}
});

$(document).on('click', '.cancelBtn', function(e) { 
try{
  
    /*$(this).parent().prevAll().each (function() {
        this.setAttribute("contenteditable", false);
        this.innerHTML="asd";
        });*/
        
        $(this).parent().prevAll().each (function() {
        $(this).find('input').each(function () {
        $(this).val($(this).attr("data-default"));
            this.disabled=true;
            })
        });
        
    $(this).hide();
    $(this).siblings('.saveBtn').hide();
    $(this).siblings('.updtbtn').show();

}
catch(err){alert(err);}
});

$(document).on('click', '.saveBtn', function(e) { 
try{
  
    $(this).parent().prevAll().each (function() {
        this.setAttribute("contenteditable", false);
        });
        
    $(this).hide();
    $(this).siblings('.cancelBtn').hide();
    $(this).siblings('.updtbtn').show();
    
    var data={};
    
    
    $(this).parent().prevAll().each(function() {
    var field = this.className;
    //alert(field);
    $(this).find('input').each(function () {
     data[field]=this.value;	
    
        })
    });
    
    //alert(JSON.stringify(data));
    
    $.ajax(
    {
        url : "http://localhost:5000/update",
        type: "POST",
        data : data,
        beforeSend: function(){
                        $('#ajax-loader').show();
                        
                    },
        complete: function(){
                    $('#ajax-loader').hide();
                    
                },
        success:function(result) 
        {
            alert(JSON.stringify(result.message));
            window.location="http://localhost:5000/home";
             //$("#result").html(JSON.stringify(data.message));
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
        alert(textStatus);
        }
    });

//});
    
    
    

}
catch(err){alert(err);}
});


$(document).on('click', '.delBtn', function(e) { 
try{
var prodId="";
$(this).parent().prevAll('.prodId').each(function() {
    $(this).find('input').each(function () {
     prodId=this.value;	
    
        })
    });
    
    //prodId=$(this).parent().prevAll('.prodId').find('input').value;
    //alert(prodId);
    
var userchoice =confirm("You are attempting to delete product: "+prodId+ "?\nClick 'Ok' to proceed.");

if (userchoice == true)
{
    
    $.ajax({
            type: "DELETE",
            url:"http://localhost:5000/delete/?prodId="+prodId,
            
            success: function(data)
            {  
                if(data)
                {
                    
                    alert(JSON.stringify(data));
                    window.location.reload();
                }
            
            },
            error: function() {
                alert('Some problem occured during deletion.');
            }

            });
}
  
    

}
catch(err)
{
    alert(err);
}
    
 
});

$(document).on('click', '.addBtn', function(e) { 
try{
  
window.location='\\create';

}
catch(err){alert(err);}
});

//------------------- Start: Register user popup JS ----

$( function() {
var dialog, form,

// From http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#e-mail-state-%28type=email%29
emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
name = $( "#name" ),
email = $( "#email" ),
password = $( "#password" ),
confPassword=$('#confPassword')
allFields = $( [] ).add( name ).add( email ).add( password ),
tips = $( ".validateTips" );
//userData={'username':name.val(),'email':email.val()}
userData=$('#user-form').serializeArray();

function updateTips( t ) {
tips
  .text( t )
  .addClass( "ui-state-highlight" );
setTimeout(function() {
  tips.removeClass( "ui-state-highlight", 1500 );
}, 500 );
}

function checkLength( o, n, min, max ) {
if ( o.val().length > max || o.val().length < min ) {
  o.addClass( "ui-state-error" );
  updateTips( "Length of " + n + " must be between " +
    min + " and " + max + "." );
  return false;
} else {
  return true;		
}
}

function checkRegexp( o, regexp, n ) {
if ( !( regexp.test( o.val() ) ) ) {
  o.addClass( "ui-state-error" );
  updateTips( n );
  return false;
} else {
  return true;
}
}

function checkPassword(password,confPassword,n)
{
    if(password.val == confPassword.val) {
        return true;
    }
    else {
        password.addClass("ui-state-error");
        confPassword.addClass("ui-state-error");
        updateTips( n );
        return false;
    }
}

function addUser() {
var valid = true;
allFields.removeClass( "ui-state-error" );

valid = valid && checkLength( name, "username", 3, 16 );
valid = valid && checkLength( email, "email", 6, 80 );
valid = valid && checkLength( password, "password", 5, 16 );
valid = valid && checkLength( confPassword, "confPassword", 5, 16 );

valid = valid && checkRegexp( name, /^[a-z]([0-9a-z_\s])+$/i, "Username may consist of a-z, 0-9, underscores, spaces and must begin with a letter." );
valid = valid && checkRegexp( email, emailRegex, "eg. ui@jquery.com" );
valid = valid && checkRegexp( password, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9" );
valid=  valid && checkPassword(password,confPassword, "Passwork and Confirm password do not match.");
if ( valid ) {
    $.ajax(
    {
        url : "http://localhost:5000/register",
        type: "POST",
        data : userData,
        
        beforeSend: function(){
                        $('#ajax-loader').show();
                    },
        complete: function(){
                    $('#ajax-loader').hide();
                },
        success:function(result) 
        {
            alert(JSON.stringify(result.message));
            
            //$("#result").html(JSON.stringify(data.message));
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
        alert(textStatus);
        }
    });
//  $( "#users tbody").append( "<tr>" +"<td>" + name.val() + "</td>"+"<td>" + email.val() + "</td>" + "<td>" + password.val() + "</td>" + "</tr>" ); 
dialog.dialog( "close" );
}
return valid;
}

dialog = $( "#dialog-form" ).dialog({
autoOpen: false,
height: 500,
width: 450,
modal: true,
buttons: {
  "Create an account": addUser,
  Cancel: function() {
    dialog.dialog( "close" );
  }
},
close: function() {
  form[ 0 ].reset();
  allFields.removeClass( "ui-state-error" );
}
});

form = dialog.find( "form" ).on( "submit", function( event ) {
event.preventDefault();

alert("dddd");
addUser();
});

$( "#create-user" ).button().on( "click", function() {
dialog.dialog( "open" );
});
} );


//------ End: Register user popup JS ----------------------------
