import Editor from './editor'
import MoveData from './moveData'
import { JkfObject, BoardObject } from './const/interface'

let editor: Editor

export default class JkfEditor {
  constructor(jkf: JkfObject = {}, readonly: boolean = false) {
    editor = new Editor(jkf, readonly)
  }

  public get currentNum() {
    return editor.currentNum
  }

  public set currentNum(num: number) {
    editor.go(num)
  }

  public get board(): Array<Array<BoardObject>> {
    return editor.board
  }

  public get hands(): Array<{ [index: string]: number }> {
    return editor.hands
  }

  public get comment(): any {
    return editor.comment
  }

  public get isFork(): boolean {
    return editor.isFork
  }

  public get lastMove(): MoveData {
    return new MoveData(editor.lastMove)
  }

  public get nextMoves(): Array<MoveData> {
    return editor.nextMoves.map(nextMove => {
      return new MoveData(nextMove)
    })
  }

  public go(newNum: number) {
    editor.go(newNum)
  }

  public dispKifuMoves(): string {
    return editor.dispKifuMoves()
  }

  public dispNextMoves(): string {
    return editor.dispNextMoves()
  }

  public switchFork(forkIndex: number) {
    editor.switchFork(forkIndex)
  }

  public addBoardMove(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    promote: boolean = false,
    comment: Array<string> | string | null = null
  ) {
    editor.addBoardMove(fromX, fromY, toX, toY, promote, comment)
  }

  public addHandMove(
    komaString: string,
    toX: number,
    toY: number,
    comment: Array<string> | string | null = null
  ) {
    editor.addHandMove(komaString, toX, toY, comment)
  }

  public addComment(comment: string) {
    editor.addComment(comment)
  }
}

module.exports = JkfEditor

// 次の実装
// TODO: フォーマットを公式から取るようにする
// TODO: lodash依存の削除
// TODO: throw Errorを最低限しか利用しないようにする
// TODO: 型定義ファイルに含まれるprivate変数を除去する
// TODO: disp〜()で提供されている情報相当のオブジェクトを返すAPIの作成
// TODO: 成れない駒に対するpromoteなどありえない動作の検出をより厳密に行う
// TODO: 相対位置判定のテスト・実装
// TODO: 各APIの入力をオブジェクトにする
// TODO: 棋譜ツリーの表示機能をつける
// TODO: ドキュメント整備
// TODO: npm登録
// TODO: npm経由でのimport時に不要なプロパティが表示されてしまう問題を解決
// TODO: nextMoves, kifuMovesの返り値を再検討