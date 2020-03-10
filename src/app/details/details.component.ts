import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MainAttrInterface, SpecAttrInterface, DocumentInterface } from '../interfaces/document.interface';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Globals } from '../globals';
import { HttpParams, HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from '../login.service';
import { AppComponent } from '../app.component';
declare var $: any;

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  user: any;

  alerts: any[] = [];
  alert_msg: string = "";
  
  optionsDocumentType = [
    {value: '0', label: 'Regulation'},
    {value: '1', label: 'Legislation'},
    {value: '2', label: 'Patent'},
    {value: '3', label: 'Sectorial report'}
  ];
                              
  selectedDocumentType: string;

  selectedDocument = {
		'mainAttr': {
			'documentType': '',
    		'dateEntry': '',
    		'code': '',
    		'title': '',
    		'description': ''
		} as MainAttrInterface,
		'specAttr': {
			'regulationType': '',
    		'regulationNumber': '',
			'descriptors0': '',
			'descriptors1': '',
			'patentCode': '',
			'company': '',
			'scope': '',
			'countriesOfInterest': '',
			'descriptors2': '',
			'authors': '',
			'dateOfDocument': '',
			'country': '',
			'descriptors3': ''
		} as SpecAttrInterface,
		"dateEntryFromConv": '',
		"dateEntryToConv": ''
  } as DocumentInterface;
  
  // FORMGROUP DETAILS
  formDetails: FormGroup;

	seldoc_code = new FormControl("");
	seldoc_title = new FormControl("");
	seldoc_description = new FormControl("");
	seldoc_dateEntry = new FormControl("");

	seldoc_regulationType = new FormControl("");
	seldoc_regulationNumber = new FormControl("");
	seldoc_technicalCommittee = new FormControl("");
	seldoc_editingDate = new FormControl("");
	seldoc_numOfPages = new FormControl("");
	seldoc_language = new FormControl("");
	seldoc_identifyEN = new FormControl("");

	seldoc_legalAssessment = new FormControl("");
	seldoc_link = new FormControl("");
	seldoc_country = new FormControl("");
	seldoc_publicationDate = new FormControl("");
	seldoc_documentOrigin = new FormControl("");

	seldoc_authors = new FormControl("");
	seldoc_dateOfDocument = new FormControl("");
	seldoc_descriptors = new FormControl("");

  
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    public loginService: LoginService,
    private translate: TranslateService,
    private appComponent: AppComponent
  ) { 
    this.formDetails = fb.group({
      "seldoc_code": this.seldoc_code,
      "seldoc_title": this.seldoc_title,
      "seldoc_description": this.seldoc_description,
      "seldoc_dateEntry": this.seldoc_dateEntry,
      "seldoc_regulationType": this.seldoc_regulationType,
      "seldoc_regulationNumber": this.seldoc_regulationNumber,
      "seldoc_technicalCommittee": this.seldoc_technicalCommittee,
      "seldoc_editingDate": this.seldoc_editingDate,
      "seldoc_numOfPages": this.seldoc_numOfPages,
      "seldoc_language": this.seldoc_language,
      "seldoc_identifyEN": this.seldoc_identifyEN,
      "seldoc_legalAssessment": this.seldoc_legalAssessment,
      "seldoc_country": this.seldoc_country,
      "seldoc_publicationDate": this.seldoc_publicationDate,
      "seldoc_documentOrigin": this.seldoc_documentOrigin,
      "seldoc_authors": this.seldoc_authors,
      "seldoc_dateOfDocument": this.seldoc_dateOfDocument,
      "seldoc_descriptors": this.seldoc_descriptors
    });
    translate.use(this.loginService.getSelectedLanguage());
  }

  ngOnInit() {
    this.user = JSON.parse( localStorage.getItem("user") );

    this.route.paramMap.subscribe(params => {
      this.selectedDocumentType = params.get('docType');
      var idDoc = params.get('docId');
      this.loadDocumentDetails(idDoc);
    });
  }

  loadDocumentDetails(idDoc:string) {
    var docType = this.selectedDocumentType;
    var attrList = this.fillAttrbsToRetrieve(docType);
  
    var url = Globals.urlServiceRoot + "/rest/document/get/" + idDoc + "/" + attrList;
    console.log (url);
  
    const params = new HttpParams()
        .set('aToken', 'Bearer ' + this.user.accessToken)
        .set('authMode', Globals.authMode);
  
    this.appComponent.loading = true;
    this.http.get(url, {params}).subscribe(
      (res : any[])=>{
        console.log("Document details:" + JSON.stringify(res));
        this.selectedDocument = res as DocumentInterface;
  
        this.seldoc_code.setValue(this.selectedDocument.mainAttr.code);
        this.seldoc_title.setValue(this.selectedDocument.mainAttr.title);
        this.seldoc_description.setValue(this.stripHtml(this.selectedDocument.mainAttr.description));
        this.seldoc_dateEntry.setValue(this.formatOutDate(this.selectedDocument.mainAttr.dateEntry));
  
        this.seldoc_regulationType.setValue(this.selectedDocument.specAttr.regulationType);
        this.seldoc_regulationNumber.setValue(this.selectedDocument.specAttr.regulationNumber);
        this.seldoc_technicalCommittee.setValue(this.selectedDocument.specAttr.technicalCommittee);
  
        this.seldoc_editingDate.setValue(this.selectedDocument.specAttr.editingDate);
        this.seldoc_numOfPages.setValue(this.selectedDocument.specAttr.numOfPages);
        this.seldoc_language.setValue(this.selectedDocument.specAttr.language);
        this.seldoc_identifyEN.setValue(this.selectedDocument.specAttr.identifyEN);
        this.seldoc_legalAssessment.setValue(this.selectedDocument.specAttr.legalAssessment);
        this.seldoc_link.setValue(this.selectedDocument.specAttr.link);
  
        this.seldoc_country.setValue(this.selectedDocument.specAttr.country);
        this.seldoc_publicationDate.setValue(this.selectedDocument.specAttr.publicationDate);
        this.seldoc_documentOrigin.setValue(this.selectedDocument.specAttr.documentOrigin);
        this.seldoc_authors.setValue(this.selectedDocument.specAttr.authors);
        this.seldoc_dateOfDocument.setValue(this.selectedDocument.specAttr.dateOfDocument);
  
        this.seldoc_descriptors.setValue(this.selectedDocument.specAttr.descriptors);
          
        /* Fix some properties */
        //this.downloadLink = this.generateDownloadLink(idDoc, this.selectedDocument.specAttr.urldocu, docType);
        this.alert_msg = "Document loaded succesfully";
        this.alerts.push({
          type: 'success',
          message: this.alert_msg,
        });
        this.translate.get(this.alert_msg).subscribe((res: string) => {
          this.alert_msg = res;
        });
        
        /* Make visible the chunk of properties associated to the selectedDocumentType */
        $('#cardDocumentDetails').fadeIn('slow');
        this.setVisibleDetailsChunk(docType);

        this.appComponent.loading = false;
      },
      error => {
        var msg = "";
        if (error.data != null)
          msg = error.data.description;
        else 
          msg = error.message;
          
        this.alerts.push({
          type: 'danger',
          message: msg,
        });
        this.appComponent.loading = false;
      }
    );
  
    $('#cardDocumentDetails').fadeIn('slow');
  }

  fillAttrbsToRetrieve(docType:string) {
    var attrList = "";
  
    switch(docType) {
      case "0":
        //Regulation		    	
        attrList = "regulationType,regulationNumber,descriptors," +
            "technicalCommittee,editingDate,numOfPages,language,country,identifyEN";
        break;
      case "1":
        //Legislation
        attrList = "descriptors,legalAssessment,link,country,publicationDate,documentOrigin";
        break;
      case "2":
        //Patent
        break;
      case "3":
        //Report
        attrList = "authors,dateOfDocument,country,descriptors";
        break;
      default:
        break;
    }
    return attrList;
  }
  
  setVisibleDetailsChunk(docType:string) {
    for (var i = 0; i < 4; i++) {
      $('#detailsChunk' + i).addClass('d-none');
    }
    
    $('#detailsChunk' + docType).removeClass('d-none');
  }

  formatOutDate(date:string) {
    /*
    * Dates returned from server are formatted "yyyy-mm-dd hh:MM:ss"
    * They should be converted to var dateFormat = "dd-mm-yyyy"
    */
    if (date != null && date != undefined) {		
      var posBlank = date.indexOf(" ");
      if (posBlank != -1) {
        date = date.substring(0, posBlank);
      }
  
      const [year, month, day] = date.split("-");
      
      var dateOut = Globals.datePlaceholder;
      var dateOut = dateOut.replace("yyyy", year);
      var dateOut = dateOut.replace("mm", month);
      var dateOut = dateOut.replace("dd", day);
  
      return dateOut;
    } else {
      return "";
    }
  }

  stripHtml(html:string) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  closeAlert(alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

}
