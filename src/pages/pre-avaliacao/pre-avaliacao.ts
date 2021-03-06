import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {NivelService} from "../../services/nivel";
import {Nivel} from "../../data/nivelInterface";
import {Setor} from "../../data/setorInterface";
import {Observable} from "rxjs/index";
import {map} from "rxjs/operators";
import {Avaliacao} from "../../data/avaliacaoInterface";
import {AvaliacaoService} from "../../services/avaliacao";
import {SetorService} from "../../services/setor";
import {AvaliacaoPage} from "../avaliacao/avaliacao";

/**
 * Generated class for the PreAvaliacaoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pre-avaliacao',
  templateUrl: 'pre-avaliacao.html',
})
export class PreAvaliacaoPage {

  niveis$: Observable<Nivel[]>;
  nivelPretendido: string;
  setor: Setor;
  botaoInicialDisabled: boolean;

  constructor(
              public navCtrl: NavController,
              public navParams: NavParams,
              private nivelService: NivelService,
              private avaliacaoService: AvaliacaoService,
              private setorService: SetorService,
              private viewCtrl: ViewController
  ) {

    // Método não faz nada. Está aqui para que não
    // seja gerada a mensagem de desuso da variável
    // 'setorService' no deploy.
    this.setorService.exist();
    //

    this.botaoInicialDisabled = true;

    this.niveis$ = this.nivelService
      .getAllasList() //DB LIST
      .snapshotChanges()// KEY AND VALUE
      .pipe(map(
        changes => {
          return changes.map(c => ({
            key: c.payload.key, ...c.payload.val(),
          }));
        }
      ));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PreAvaliacaoPage');
  }

  ngOnInit(){
    this.setor = this.navParams.get('setor');
  }

  iniciarAvaliacao() {

    let avaliacao: Avaliacao = {
      setor: this.setor.key,
      dataInicio: this.avaliacaoService.getDataAgora(),
      nivelPretendido: this.nivelPretendido,
      corpo: []
    };

    this.salvaNovaAvaliacao(avaliacao, this.insereNovaAvaliacao);
  }



  salvaNovaAvaliacao(avaliacao: Avaliacao, insereNovaAvaliacao){

    let niveis: Nivel[];
    niveis = [];

    this.niveis$.forEach( nivel_array =>{
      nivel_array.forEach(nivel => {
        niveis.push(nivel);
      })
    });

    avaliacao.corpo = niveis;

    insereNovaAvaliacao(avaliacao, this);

    // this.avaliacaoService.getAvaliacaoMaisRecente(this.setor.key, this.abrirPaginaAvaliacao, this);

    this.fecharPágina();

  }

  insereNovaAvaliacao(avaliacao: Avaliacao, self){
    // self.avaliacaoService.save(avaliacao);
    self.avaliacaoService.saveAndWait(avaliacao,self.abreAvaliacao,self);
    self.setor.sendoAvaliado = true;
    self.setorService.save(self.setor);
  }

  abreAvaliacao(self){
    self.avaliacaoService.getAvaliacaoMaisRecente(self.setor.key, self.abrirPaginaAvaliacao, self);
  }

  fecharPágina(){
    this.viewCtrl.dismiss();
  }

  abrirPaginaAvaliacao(refAvaliacaoCorrente, self){

    self.navCtrl.push(
      AvaliacaoPage,
      {
        setor: self.setor,
        avaliacao: refAvaliacaoCorrente
      });
  }

}
