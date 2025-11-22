<SectionTitle title="モノレポ・マルチレポそれぞれのメンテコスト" />

---

## モノレポ・マルチレポでスキーマのメンテコストは変わる

<br/>

### モノレポの場合

- 直接FE,BEのIF格納先へ生成＆プッシュ

<br/>

### マルチレポの場合

- **スキーマの更新をどのように各レイヤーのエンジニアに通知するか？**
- Hono RPCのようなモノレポ前提の運用は難しくなる
  - Enterprise PackageやコンテナイメージPull等での解決は一応できる
- 型同期のインフラ整備が手間かかる
  - CI等でのチェックなど

<SectionTitle v-click style="position:absolute;top:0;left:0; background:#000b" title="規模に合わせた自動化を"/>

---

<SectionTitle title="まとめ"/>

---

### まとめ

<div>
    <div class="flex" style="height:16rem">
        <SectionCard class="pa-2">
            <h3 class="whitespace-pre-wrap">{{"SDDのコスト効果はチーム背景と\r\n時間軸によって複雑に変化する"}}</h3>
            <ul class="mt-2 text-xl">
                <li>一概に「必ず導入しよう！」と言えるシロモノではない。ご利用は計画的に</li>
                <li v-mark.red.circle class="font-bold">「そのスキーマ、いま必要ですか？」</li>
            </ul>
        </SectionCard>
        <SectionCard class="pa-2 ml-2">
            <h3>導入するときはチーム、特にBEエンジニアとよく相談して合意を取ろう</h3>
            <ul class="mt-2 text-xl">
                <li v-mark.yellow.circle>Positive-Sumを目指す</li>
                <li>「これはどちらがやった方が早いか？」という視点</li>
            </ul>
        </SectionCard>
    </div>
    <SectionCard class="h-25 pa-2 mt-4">
        <h3>運用コスト自体はできる限り下げた方がいい</h3>
        <ul class="mt-2 text-xl">
            <li>導入・メンテナンス・学習コストをペイできるか</li>
            <li v-mark.blue.circle>新規PJなら技術選定・リポジトリ戦略の判断が重要</li>
            <li>途中から導入するなら実装優先をまず考え、難しければスキーマ優先を考える</li>
        </ul>
    </SectionCard>
  </div>

---

<SectionTitle title="SDDをうまく組み込み、プロダクト開発を快適にしよう！"/>
